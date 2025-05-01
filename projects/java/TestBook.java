import java.util.*;
public class TestBook {
	
	public static void main(String[] args){

			Book book1 = new Book("John The Dog","Garfield","959125",true);

			ArrayList<Book> books = new ArrayList<Book>();

			books.add(book1);

			for(Book x: books){

				System.out.println(x);
			}


	}
}