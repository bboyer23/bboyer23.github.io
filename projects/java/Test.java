public class Test {
	
	private String greet;
	private String prompt;
	private String name;

	public Test(){

		greet = "Default";
		prompt = "Default";	
		name = "N/A";



	}

	public Test(String greet, String prompt, String name){

		this.greet = greet;
		this.prompt = prompt;
		this.name = name;
	}

	@Override
	public String toString(){

		return String.format("Greet: %s Prompt: %s Name: %s",greet,prompt,name);
	}

}