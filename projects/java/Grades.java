/**
 * 
 * 	Author: Benjamin Bouer
 * 	Date: February 28th, 2024
 * 	Purpose / Scope:
 * 
 * 		Grade book class that tracks
 *		
 * 		Number of students
 * 		Number of tests
 * 		grades per test 
 * 		The average of the number of tests
 *  
 * 
 * 
 * 
 * */
public class Grades {
	
	// create string to store course name
	private String courseName;
	// create 2D array 10x3 (10 students, 3 grades)
	private int[][] grades = new int[10][3];

	// default no argument constructor with default value for coursename and empty 10x3 array
	public Grades(){

		courseName = "Default";

		// confirm values start as 0

		for(int i = 0; i < grades.length; i++){

			for(int j = 0; j < grades[i].length; j++){

				grades[i][j] = 0;
			}

			System.out.println();
		}
	}

	public Grades(String courseName, int[][] grades){

		this.courseName = courseName;
		this.grades = grades;
	}

	public void displayGrades(int grades[][]){

		 for(int i = 0; i < grades.length; i++){

			for(int j = 0; j < grades[i].length; j++){

				System.out.println(grades[i][j]);
			}

			System.out.println();
		}


	}

	public String toString(){

		return "Course: " + courseName +  " The grades are: " +  displayGrades(grades[][]);
	}











}