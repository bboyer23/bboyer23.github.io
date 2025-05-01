public class TestCustomer {

    public static void main(String[] args) {

        Customer customer = new Customer("John Doe", "123 Main St", "123-456-7890", 12345, true);

        System.out.println("Name: " + customer.getName());

        System.out.println("Address: " + customer.getAddress());

        System.out.println("Telephone Number: " + customer.getTelephoneNumber());

        System.out.println("Customer Number: " + customer.getCustomerNumber());

        System.out.println("Mailing List: " + (customer.isOnMailingList() ? "Yes" : "No"));
        
    }
}