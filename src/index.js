function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    
    let tokensArr = tokenizeExpression(expr);
    return calculateExpression(tokensArr);
    
}

function doSimpleOperation(a, b, op) {
    switch(op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return a / b;
    }
}

const operatorArr = ['+', '-', '*', '/'];

function tokenizeExpression(expr) {
    let tokensArr = [];
    let startIndex = 0;
    let num;
    let bracketsStack = [];
    for(let i = 0; i < expr.length; i++) {
        if(expr[i] == '(') {
            tokensArr.push(expr[i]);
            bracketsStack.push('(');
            startIndex = i + 1;
        }
        else if(expr[i] == ')') {
            if(bracketsStack.length == 0 || bracketsStack[bracketsStack.length - 1] != '(') {
                throw new Error('ExpressionError: Brackets must be paired');
            }
            bracketsStack.pop();
            num = Number(expr.slice(startIndex, i));
            if(!isNaN(num)) tokensArr.push(num);
            tokensArr.push(expr[i]);
        }
        else if(operatorArr.includes(expr[i])) {
            num = Number(expr.slice(startIndex, i));
            if(!isNaN(num)) tokensArr.push(num);
            tokensArr.push(expr[i]);
            startIndex = i + 1;
        }
        else if(i == expr.length - 1) {
            num = Number(expr.slice(startIndex));
            if(!isNaN(num)) tokensArr.push(num);
        }
    }
    if(bracketsStack.length != 0) throw new Error('ExpressionError: Brackets must be paired');

    return tokensArr;
}



function calculateExpression(arr) {
    let replacement;

    while(arr.includes('(')) {

        let start = arr.indexOf('(');
        let end = arr.indexOf(')');
        while(arr.indexOf('(', start + 1) != -1 && arr.indexOf('(', start + 1) < end) {
            start = arr.indexOf('(', start + 1);
        }
        replacement = calculateExpression(arr.slice(start + 1, end));
        arr.splice(start, end - start + 1, replacement);
        
    }

    for(let i = 0; i < arr.length; i++) {
        if(arr[i] == '*' || arr[i] == '/') {
            if(arr[i] == '/' && arr[i+1] == 0) {
                throw new Error('TypeError: Division by zero.')
            }
            replacement = doSimpleOperation(arr[i-1], arr[i+1], arr[i]);
            arr.splice(i-1, 3, replacement);
            i = i - 1;
        }
    }

    for(let i = 0; i < arr.length; i++) {
        if(arr[i] == '+' || arr[i] == '-') {
            replacement = doSimpleOperation(arr[i-1], arr[i+1], arr[i]);
            arr.splice(i-1, 3, replacement);
            i = i - 1;
        }
    }

    return arr[0];
}



module.exports = {
    expressionCalculator
}