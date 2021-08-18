package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Print("Hello, ")
	fmt.Print(".")
	time.Sleep(500 * time.Millisecond)
	fmt.Print(".")
	time.Sleep(500 * time.Millisecond)
	fmt.Print(".")
	time.Sleep(500 * time.Millisecond)
	fmt.Print(". ")
	time.Sleep(500 * time.Millisecond)
	fmt.Println("world!")
}

