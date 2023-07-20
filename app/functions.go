package app

import "fmt"

func removeFromSlice(slice []int, element int) []int {
	fmt.Println(element, "slice before:", slice)
	var result []int
	for _, item := range slice {
		if item != element {
			result = append(result, item)
		}
	}
	fmt.Println("slice after:", result)
	return result
}
