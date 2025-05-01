public class Book {
	
	private String title;
	private String author;
	private String ibsn;
	private boolean isAvailable;

	public Book(){

		this.title = "n/a";
		this.author = "n/a";
		this.ibsn = "n/a";
		this.isAvailable = false;

		

	}


	public Book(String title,String author,String ibsn,boolean isAvailable){

		this.title = title;
		this.author = author;
		this.ibsn = ibsn;
		this.isAvailable = isAvailable;

	}

	// getters

	public String getTitle(){

		return title;

	}

	public String getAuthor(){

		return author;
	}

	public String getIbsn(){

		return ibsn;
	}

	public boolean getIsAvailable(){

		return isAvailable;
	}

	// setters

	public void setTitle(String title){

		this.title = title;
	}

	public void setAuthor(String author){

		this.author = author;
	}

	public void setIbsn(String ibsn){

		this.ibsn = ibsn;
	}

	public void setIsAvailable(boolean isAvailable){

		this.isAvailable = isAvailable;
	}
	
	public void borrowBook(){

		 if (isAvailable) {
            isAvailable = false;
            // Additional logic when a book is borrowed
        } else{

        	System.out.println("The book is not currently available");
        }

	}

	public void returnBook(){

		 isAvailable = true;

	}

	@Override
	public String toString(){

		return 
			  "\tTitle " + title
			+ "\n\tAuthor " + author
			+  "\n\tIBSN " + ibsn
			+  "\n\tState " + isAvailable;

	}

	
}