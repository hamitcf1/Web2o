// Scramble Effect

document.addEventListener("DOMContentLoaded", function () {
    function scrambleEffect(element, duration = 1000) {
        const originalText = element.getAttribute("data-text").split("");
        const chars = "!@#$%^&*()_+{}:?><,./;'[]-=";
        let iterations = 10;
        let scrambledArray = [...originalText];
        let count = 0;

        function updateScramble() {
            if (count < iterations) {
                scrambledArray = scrambledArray.map((char, i) =>
                    Math.random() > 0.5 ? chars[Math.floor(Math.random() * chars.length)] : originalText[i]
                );
                element.textContent = scrambledArray.join("");
                count++;
                setTimeout(updateScramble, duration / iterations);
            }
        }
        updateScramble();
    }

    function restoreTextLetterByLetter(element, duration = 1000) {
        const originalText = element.getAttribute("data-text").split("");
        const chars = "!@#$%^&*()_+{}:?><,./;'[]-=";
        let scrambledArray = [...element.textContent];
        let currentIndex = 0;

        function restoreLetter() {
            if (currentIndex < originalText.length) {
                let iterations = 5;
                let innerCount = 0;

                function innerScramble() {
                    if (innerCount < iterations) {
                        scrambledArray[currentIndex] = chars[Math.floor(Math.random() * chars.length)];
                        element.textContent = scrambledArray.join("");
                        innerCount++;
                        setTimeout(innerScramble, duration / (iterations * originalText.length));
                    } else {
                        scrambledArray[currentIndex] = originalText[currentIndex];
                        element.textContent = scrambledArray.join("");
                        currentIndex++;
                        setTimeout(restoreLetter, duration / originalText.length);
                    }
                }
                innerScramble();
            }
        }
        restoreLetter();
    }

    document.querySelectorAll(".scramble-text").forEach((element) => {
        element.addEventListener("mouseenter", () => scrambleEffect(element));
        element.addEventListener("mouseleave", () => restoreTextLetterByLetter(element));
    });
});
