


const Codeexample = {

cpp : 
`// This is Demo Code for example

#include <bits/stdc++.h>
using namespace std;

// simple hello world program
int main()
{
    cout<<"Hello World !!";
    return 0;
}        

`,

py : 
`# This is Demo Code for example

# program for factorial of number
def factorial(n):
    if n < 0:
        return 0
    elif n == 0 or n == 1:
        return 1
    else:
        fact = 1
        while(n > 1):
            fact *= n
            n -= 1
        return fact
 
num = 5;
print("Factorial of",num,"is", factorial(num))

`,



java : 
`# This is Demo Code for example

`,

js : 
`// This is Demo Code for example

console.log("hii javascript")
`,


}

module.exports = Codeexample;