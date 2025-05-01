// Main method to test the Matrix class
public class TestMatrix {
    public static void main(String[] args) {
        Matrix matrix = new Matrix(3, 3); // Create a 3x3 matrix

        // Set elements of the matrix
        matrix.setElement(0, 0, 1);
        matrix.setElement(0, 1, 2);
        matrix.setElement(0, 2, 3);
        matrix.setElement(1, 0, 4);
        matrix.setElement(1, 1, 5);
        matrix.setElement(1, 2, 6);
        matrix.setElement(2, 0, 7);
        matrix.setElement(2, 1, 8);
        matrix.setElement(2, 2, 9);

        // Display the matrix
        matrix.displayMatrix();
    }
}