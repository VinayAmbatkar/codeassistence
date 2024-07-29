document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat');
    const userInput = document.getElementById('userInput');

    const addMessage = (message, sender, imageUrl = null) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        
        const textElement = document.createElement('p');
        textElement.textContent = message;
        messageElement.appendChild(textElement);
        
        if (imageUrl) {
            const imageElement = document.createElement('img');
            imageElement.src = imageUrl;
            messageElement.appendChild(imageElement);
        }
        
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const fetchProductRecommendation = async (category) => {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const products = await response.json();
            const filteredProducts = products.filter(product => product.category.toLowerCase().includes(category.toLowerCase()));
            const recommendedProducts = filteredProducts.slice(0, 4); // Get top 4-5 products
            return recommendedProducts.map(product => ({
                text: `I recommend the ${product.title}. It costs $${product.price}.`,
                imageUrl: product.image
            }));
        } catch (error) {
            return [{
                text: 'Sorry, I am unable to fetch product recommendations at the moment.',
                imageUrl: null
            }];
        }
    };

    const handleUserMessage = async () => {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, 'user');
            userInput.value = '';

            if (!window.productCategory) {
                addMessage('What type of products are you interested in? (e.g., electronics, clothing, accessories)', 'bot');
                window.productCategory = true;
            } else {
                const botResponses = await fetchProductRecommendation(userMessage);
                botResponses.forEach(response => addMessage(response.text, 'bot', response.imageUrl));
                window.productCategory = false;
            }
        }
    };

    window.sendMessage = handleUserMessage;

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleUserMessage();
        }
    });

    addMessage('Welcome! How can I assist you today?', 'bot');
});
