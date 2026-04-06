#!/bin/bash

# Name of your Node.js entry file
FILE="index.js"

# Infinite loop
while true
do
    echo "Starting $FILE..."
    node $FILE
    echo "$FILE stopped. Restarting in 2 seconds..."
    sleep 2
done