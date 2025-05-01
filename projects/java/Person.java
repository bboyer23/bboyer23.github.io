public class Person {

    // Three private fields
    // String: Name, Address, Telephone Number

    private String name;

    private String address;

    private String telephoneNumber;

    // Adding a default no argument constructor for consistency 
    public Person(){

        this.name = "";
        this.address = "";
        this.telephoneNumber = "000-000-0000";
    }

    // Constructor
    public Person(String name, String address, String telephoneNumber) {
        this.name = name;
        this.address = address;
        this.telephoneNumber = telephoneNumber;
    }

    // Mutator methods
    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setTelephoneNumber(String telephoneNumber) {
        this.telephoneNumber = telephoneNumber;
    }

    // Accessor methods
    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getTelephoneNumber() {
        return telephoneNumber;
    }
}