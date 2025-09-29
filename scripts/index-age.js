	// Replace with your own actual birth year
	const birthYear = 2000;

	// Get the current year
	const currentYear = new Date().getFullYear();

	// Calculate age based on current date and birth date
	const age = currentYear - birthYear;

	document.getElementById("age").textContent = age;