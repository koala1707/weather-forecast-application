# Weather Application
This project was built with public APIs.

## Branches
`originalMain` was created within 7 hours.

`main` took 13 hours in total.

Other branches

`ui-style` - mostly HTML and CSS
`location` - find the current location
`fetchAPI` - the main part to fetch API (Weather Data)
`errorhandler` - handle 4xx errors

## Problems
1. The weather data contains unnecessary information for this application.
2. The temperature in one day were broken down into some certain hours.
3. The temperature was just celsius.
4. 4xx Errors
5. UI Design

## Solutions
1. Retrieved only what the application needs and stored them into the array,
2. Created a fuction to calculate the average temperature.
3. Calculated fahrenheit based on the celsius.
4. Added an error handler.
5. Made a table to be able to check the weather easily.