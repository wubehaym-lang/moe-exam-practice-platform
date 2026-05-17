const user = JSON.parse(sessionStorage.getItem("currentUser"));

    // 1. SECURITY & REDIRECT CHECK
    if (!user) {
        // No user logged in? Go to login page
        window.location.href = 'index.html';
    } else if (user.passwordChanged === false) {
        window.location.href = 'chgpss.html';
    } else {
        // 2. AUTHORIZED: If we get here, the password IS changed. Run display logic.
        
        // Load the header and info panel
        

        // Update the Welcome Name
        const firstName = user.fullName.split(" ")[0]; 
        const firstNameElement = document.getElementById("firstName");
        if (firstNameElement) firstNameElement.innerText = firstName;

        // Update the Avatar (initials)
        if (typeof updateAvatars === "function") {
            updateAvatars(user.fullName);
        }

        // Update the Stream/Course Text
        const streamElement = document.getElementById("userField");
        if (streamElement) {
            streamElement.innerText = user.stream;
        }

        // Handle clicking the course card to go to 'att.html'
        const courseCard = document.getElementById('courseCard');
        const openCourse = () => { window.location.href = 'View.html'; };

        if (courseCard) courseCard.addEventListener('click', openCourse);
        if (streamElement) streamElement.addEventListener('click', openCourse);

        

        document.title = user.stream + " Exam Overview";
    }