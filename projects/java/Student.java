/*


Design a class named Student with id, name, telephone_no, and courses_registered as
instance variables. 

Provide a constructor with four arguments for initializing the instance
variables.

 Write a method for adding a new course (this method can just update the
courses_registered).

 Write a method named printInfo that prints the details of the Student
object.

Test the Student class using a driver program by creating multiple student objects and
invoking the instance methods.

*/

public class Student{


	private int ID;
	private int courses_registered;
	private String name;
	private String telephone_no;


	public Student(int ID, int courses_registered, String name, String telephone_no){

		this.ID = ID;
		this.courses_registered = courses_registered;
		this.name = name;
		this.telephone_no = telephone_no;

	}

	public void addCourse(){

		courses_registered++;
	}

	public void printInfo(){

		System.out.println("ID #: " + this.ID + "\nCourses Registered: " + courses_registered + "\nName: " + name + "\nPhone #: " + telephone_no);
	}











}