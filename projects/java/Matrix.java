public class Matrix {
    private int rows; // Number of rows
    private int columns; // Number of columns
    private int[][] elements; // Elements of the matrix in a 2D array

    // Constructor to initialize the matrix
    public Matrix(int rows, int columns) {
        this.rows = rows;
        this.columns = columns;
        this.elements = new int[rows][columns]; // Initialize the size of the matrix
    }

    // Method to set the value of an element in the matrix
    public void setElement(int row, int column, int value) {
        if (row >= 0 && row < rows && column >= 0 && column < columns) {
            elements[row][column] = value;
        } else {
            System.out.println("Invalid index");
        }
    }

    // Method to get the value of an element in the matrix
    public int getElement(int row, int column) {
        if (row >= 0 && row < rows && column >= 0 && column < columns) {
            return elements[row][column];
        } else {
            System.out.println("Invalid index");
            return -1; // Returning -1 to indicate an error
        }
    }

    // Method to display the matrix
    public void displayMatrix() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                System.out.print(elements[i][j] + " ");
            }
            System.out.println(); // Move to the next line after printing each row
        }
    }
}