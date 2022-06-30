


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
`// This is Demo Code for example

class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); 
    }
}

`,

js : 
`// This is Demo Code for example

console.log("hii javascript")
`,

go : 
`// This is Demo Code for example

package main
import "fmt"
  
func main() {
  
    fmt.Println("!... Hello World ...!")
}

`,

r : 
`# This is Demo Code for example

# My first program in R Programming

myString <- "Hello, World!"
print(myString, quote=FALSE)

`,

rb : 
`# This is Demo Code for example

# My first program in Ruby Programming

puts "Hello Ruby !"  

`,

php : 
`<?php
//  This is Demo Code for example

//  My first program in PHP Programming

echo "Hello World! , this is php program.";


?>
`,




}

module.exports = Codeexample;