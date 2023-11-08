from flask import Flask, render_template, request, jsonify
import sqlite3
import json
import yfinance as yf
from datetime import datetime
from time import strftime

app = Flask(__name__)

def get_stock_price(ticker):
    try:
        data = yf.download(tickers=ticker, period='1d',
                            interval='1m',
                            progress=False)
        cur = data['Close']
        curr_price = cur[-1]
        price = curr_price
        return price
    except Exception as e:
        return None
    
def get_port_value(user_id):
    port_value = 0
    connection = sqlite3.connect('reactTraders')
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT * FROM portfolio
        WHERE user_id = ?
        """, (user_id,)
    )
    rows = cursor.fetchall()
    for row in rows:
        ticker_price = get_stock_price(row[1])
        port_value += (ticker_price*row[2])
    port_value = round(port_value, 2)
    
    cursor.execute(
        """
        SELECT cash_on_hand FROM users
        WHERE user_id = ?
        """, (user_id,)
    )
    rows = cursor.fetchall()
    cash = rows[0][0]
    # total portfolio value is cash on hand + value of portfolio
    return (port_value+cash)


@app.route('/movies', methods=['POST', 'GET'])
def index():
    x = request.get_json()
    username = x['username']
    password = x['password']
    connection = sqlite3.connect('reactTraders')
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT * FROM users
        WHERE username = ? AND password = ?;
        """, (username, password)
    )
    rows = cursor.fetchall()
    if len(rows) > 0:
        # if user found, return the id for that user
        return jsonify(rows[0][0])
    else:
        # else, return that user is invalid
        return jsonify('Invalid')
    return jsonify({'username': username, 'password': password})

@app.route('/portfolio', methods=['GET', 'POST'])
def portfolio():
    data = request.get_json()
    userID = data['userID']
    username = data['username']
    password = data['password']

    response = {'yourID': userID, 'yourUser': username, 'yourPass': password}
    connection = sqlite3.connect('reactTraders')
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT * FROM portfolio
        WHERE user_id = ?
        """, (userID,)
    )
    tuples = cursor.fetchall()
    if len(tuples) > 0:
        # zeroCount = 0
        # total = 0
        # for row in tuples:
        #     if row[2] == 0:
        #         zeroCount += 1
        #     total += 1
        # if zeroCount != len(tuples):
        return jsonify(tuples)
    return jsonify('Null')

@app.route('/orderhistory', methods=['GET', 'POST'])
def order_history():
    data = request.get_json()
    userID = data['userID']
    username = data['username']
    password = data['password']

    response = {'yourID': userID, 'yourUser': username, 'yourPass': password}
    connection = sqlite3.connect('reactTraders')
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT * FROM order_history
        WHERE user_id = ?
        """, (userID,)
    )
    tuples = cursor.fetchall()
    # sort by recent date
    # doesn't work because dont have exact time stored in database
    # tuples = sorted(tuples, key=lambda x: x[6], reverse=True)
    if len(tuples) > 0:
        return jsonify(tuples)
    return jsonify('Null')

# severely unfinished
@app.route('/chart', methods=['GET', 'POST'])
def chart():
    timeframe = request.get_json()
    x = timeframe['window']
    return jsonify((1,'woah'))


# route to fill in estimated cost
@app.route('/estimatedCost', methods=['GET', 'POST'])
def estimated_cost():
    data = request.get_json()
    ticker = data['ticker']
    shares = int(data['shares'])
    try:
        curr_price = get_stock_price(str(ticker))
        ticker_price = round(float(curr_price), 2)
        estimated_cost = round(curr_price*shares, 2)
        estimated_cost = ("%.2f" % estimated_cost)
        if isinstance(estimated_cost, str):
            return jsonify(estimated_cost, ticker_price)
        else:
            return jsonify('estimated not string')
    except Exception as e:
        return jsonify('error')


@app.route('/handleOrder', methods=['GET', 'POST'])
def handle_order():
    data = request.get_json()
    ticker = data['ticker']
    shares = int(data['shares'])
    userID = data['userID']
    type = data['type']
    tickerData = yf.download(tickers=ticker, period='1d',
            interval='1m',
            progress=False)
    cur = tickerData['Close']
    curr_price = cur[-1]
    estimated_cost = round(curr_price*shares, 2)
    connection = sqlite3.connect('reactTraders')
    cursor = connection.cursor()
    prevOwned = False
    successfulOrder = True
    cursor.execute(
    """
    SELECT * FROM portfolio
    WHERE ticker = ?
    AND user_id = ?
    """, (ticker, userID)
    )
    rows = cursor.fetchall()
    if len(rows) > 0:
        prevOwned = True
        currShares = rows[0][2]
        currEntry = rows[0][3]

    cursor.execute(
        """
        SELECT cash_on_hand        
        FROM users
        WHERE user_id = ?
        """, (userID,)
    )
    rows = cursor.fetchall()
    cash = rows[0][0]
    if data['type'] == 'Buy':

        if estimated_cost > cash:
            return jsonify('Funds')

        if prevOwned:
            # recalculate average entry price
            new_average = round(((currEntry*currShares)
                +(shares*curr_price))\
                /(shares+currShares),2)
            # if previously owned, update portfolio values - shares, average entry
            cursor.execute(
                """
                UPDATE portfolio
                SET shares = ?,
                    average_entry = ?
                WHERE user_id = ? AND ticker = ?;
                """, (shares+currShares, new_average, userID, ticker)
            )
            connection.commit()
        else:
            # if not previously owned, just write new values in
            cursor.execute(
                """
                INSERT INTO portfolio(user_id, ticker, shares, average_entry)
                VALUES (?, ?, ?, ?)
                """, (userID, ticker, shares, round(curr_price,2))
            )
            connection.commit()
    elif data['type'] == 'Sell':
        # make sure to check they own enough shares to sell
        if prevOwned and shares <= currShares:
            cursor.execute(
                """
                UPDATE portfolio
                SET shares = ?
                WHERE user_id = ? AND ticker = ?;
                """, (currShares-shares, userID, ticker)
            )
        elif prevOwned and shares >= currShares:
            successfulOrder = False
            return jsonify('Enough')
    

    if successfulOrder:
        if data['type'] == 'Buy':
            cursor.execute(
            """
            UPDATE users
            SET cash_on_hand = ?
            WHERE user_id = ?
            """, (cash-estimated_cost, userID)
            )
            connection.commit()
        elif data['type'] == 'Sell':
            cursor.execute(
            """
            UPDATE users
            SET cash_on_hand = ?
            WHERE user_id = ?
            """, (cash+estimated_cost, userID)
            )
        now = datetime.now()
        formatted_date = now.strftime("%Y-%m-%d")
        # write to order history
        cursor.execute(
            """
            INSERT INTO order_history(user_id, order_type, ticker, asset_price, shares, order_value, aDate)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (userID, type, ticker, round(curr_price, 2), shares, estimated_cost, formatted_date)
        )
        connection.commit()
        return jsonify('Successful order')
    

@app.route('/getvalue', methods=['GET', 'POST'])
def get_value():
    errorEncountered = False
    try:
        value = 0
        data = request.get_json()
        user_id = data['userID']
        connection = sqlite3.connect('reactTraders')
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT * FROM portfolio
            WHERE user_id = ? AND shares > 0
            """, (user_id,)
        )
        rows = cursor.fetchall()
        for row in rows:
            ticker = row[1]
            shares = row[2]
            if shares > 0:
                tickerPrice = get_stock_price(str(ticker))
                if tickerPrice != None:
                    value += (shares*tickerPrice)
                else:
                    errorEncountered = True
        # only return if error not encountered, ive got no clue how to fix this
        if not errorEncountered:
            formatted_number = f"{value:.2f}"
            float_value = float(formatted_number)
            return jsonify(float_value)
    except Exception as e:
        return jsonify(str(e))
    
@app.route('/newuser', methods=['GET', 'POST'])
def validate_new_user():
    data = request.get_json()
    username = data['username']
    password = data['password']
    connection = sqlite3.connect('reactTraders')
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT * FROM users
        WHERE username = ?;
        """, (username,)
    )
    rows = cursor.fetchall()
    if len(rows) > 0:
        # username already exists in database
        return jsonify('False')
    else:
        cursor.execute(
            """
            INSERT INTO users(username, password)
            VALUES (?,?)
            """, (username, password)
        )
        connection.commit()
        return jsonify('True')

@app.route('/newID', methods=['GET', 'POST'])
def return_new_user_id():
    data = request.get_json()
    username = data['username']
    connection = sqlite3.connect('reactTraders')
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT user_id FROM users
        WHERE username = ?
        """, (username,)
    )
    rows = cursor.fetchall()
    user_id = rows[0][0]
    return jsonify(user_id)

@app.route('/tickerprice', methods=['GET', 'POST'])
def ticker_price():
    data = request.get_json()
    ticker = data['theTicker']
    ticker_price = get_stock_price(ticker)
    return jsonify(round(ticker_price, 2))


@app.route('/chartdata', methods=['GET', 'POST'])
def chart_data():
    data = request.get_json()
    ticker = data['theTicker']
    period = data['window_size']
    the_prices = []
    if period == '1D':
        window = '1d'
        interval = '15m'

    elif period == '5D':
        window = '5d'
        interval = '1h'

    elif period == '30D':
        window = '1mo'
        interval = '1d'
    data = yf.download(ticker, period=window, interval=interval)
    price_data = data['Adj Close']
    for price in price_data:
        price = round(price, 2)
        the_prices.append(price)
    
    if period == '1D':
        time = data.index.time
        time_str = [t.strftime("%H:%M") for t in time]
        
        return jsonify(the_prices, time_str)
    else:
        time = data.index.date
        time_str = [t.strftime("%m-%d") for t in time]
        return jsonify(the_prices, time_str)

@app.route('/pnl', methods=['GET', 'POST'])
def pnl():
    data = request.get_json()
    user_id = data['userID']
    port_value = get_port_value(user_id)
    pnl = port_value-50000
    return jsonify(round(pnl, 2))



@app.route('/cash', methods=['GET', 'POST'])
def cash():
    data = request.get_json()
    user_id = data['userID']
    connection = sqlite3.connect('reactTraders')
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT cash_on_hand        
        FROM users
        WHERE user_id = ?
        """, (user_id,)
    )
    rows = cursor.fetchall()
    cash = rows[0][0]
    return jsonify(round(cash, 2))

@app.route('/portvalue', methods=['GET', 'POST'])
def port_value():
    data = request.get_json()
    user_id = data['userID']
    port_value = get_port_value(user_id)
    return jsonify(round(port_value,2))


# when you run, use this command the debug part makes the server automatically update
# so dont have to rerun on every time you make changes
# FLASK_APP=app.py flask run --port 8000 --debug
# USE THIS COMMAND TO KILL THE FLASK SERVER ON PORT 8000
# lsof -nti:8000 | xargs kill -9
