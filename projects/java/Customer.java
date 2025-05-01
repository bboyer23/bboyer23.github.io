public class Customer extends Person {
    private int customerNumber;
    private boolean mailingList;

    // Constructor
    public Customer(String name, String address, String telephoneNumber, int customerNumber, boolean mailingList) {
        super(name, address, telephoneNumber);
        this.customerNumber = customerNumber;
        this.mailingList = mailingList;
    }

    // Mutator methods
    public void setCustomerNumber(int customerNumber) {

        this.customerNumber = customerNumber;

    }

    public void setMailingList(boolean mailingList) {

        this.mailingList = mailingList;
    }

    // Accessor methods
    public int getCustomerNumber() {

        return customerNumber;
    }

    public boolean isOnMailingList() {
        
        return mailingList;
    }
}