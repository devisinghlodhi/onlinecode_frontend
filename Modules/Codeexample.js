


const Codeexample = {

cpp : 
`// This is Demo Code for example

#include <bits/stdc++.h>
using namespace std;

// simple hello world program
int main()
{
    cout<<"Hello World , This is C++ Code..!!";
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
        System.out.println("Hello, World!, This is JAVA Code."); 
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
  
    fmt.Println("!... Hello World ...GO...!")
}

`,

cs : 
`// This is Demo Code for example

class First
{
    public static void Main()
    {
        System.Console.WriteLine("Good Day! , This is C# Code. ");
    }
}

`,


r : 
`# This is Demo Code for example

# My first program in R Programming

myString <- "Hello, World!, This is R code."
print(myString, quote=FALSE)

`,

rb : 
`# This is Demo Code for example

# My first program in Ruby Programming

puts "Hello Ruby !"  

`,

kt : 
`// This is Demo Code for example

fun main() {
    println("Hello, World!, This is KOTLIN Code..!!")
} 

`,

php : 
`<?php
//  This is Demo Code for example

//  My first program in PHP Programming

echo "Hello World! , this is php program.";


?>
`,

swift : 
`
//  This is Demo Code for example

func greet() {
    print("Hello World!, This is Swift Code.")
}

// call the function
greet()

`,




}

module.exports = Codeexample;