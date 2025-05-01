public class ArrayObject {
    
    private int[] arr;

    // Default constructor initializes the array to a default size
    public ArrayObject() {
        this.arr = new int[10];
    }

    // Constructor with custom initial size
    public ArrayObject(int initialSize) {
        setArr(initialSize); // Reuse the setArr method to handle size setting
    }

    // Dynamically set the array size, with data preservation up to the new length
    public void setArr(int length) {
        if (length > 0) {
            int[] newArr = new int[length];
            if (this.arr != null) {
                // Copy existing data to the new array, up to the length of the new array
                System.arraycopy(this.arr, 0, newArr, 0, Math.min(this.arr.length, length));
            }
            this.arr = newArr;
        } else {
            System.out.println("Array size must be positive.");
        }
    }
    
    // Methods to interact with the array (e.g., setValue, getValue, etc.) could be added here
}
