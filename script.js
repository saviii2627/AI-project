const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const imageContainer = document.getElementById("imageContainer");
const loading = document.getElementById("loading");

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return alert("Please enter a prompt!");

  imageContainer.innerHTML = "";
  loading.classList.remove("hidden");

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY"
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: "512x512"
      })
    });

    const data = await response.json();
    const imageUrl = data.data[0].url;

    const img = document.createElement("img");
    img.src = imageUrl;
    imageContainer.appendChild(img);
  } catch (error) {
    alert("Something went wrong. Check the console.");
    console.error(error);
  } finally {
    loading.classList.add("hidden");
  }
});

const imageUpload = document.getElementById("imageUpload");
const uploadedImageContainer = document.getElementById("uploadedImageContainer");

imageUpload.addEventListener("change", () => {
  const file = imageUpload.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    uploadedImageContainer.innerHTML = "";
    const img = document.createElement("img");
    img.src = e.target.result;
    uploadedImageContainer.appendChild(img);
  };
  reader.readAsDataURL(file);
});


const toggleChat = document.getElementById("toggleChat");
const assistantPanel = document.getElementById("assistantPanel");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

toggleChat.addEventListener("click", () => {
  assistantPanel.style.display = assistantPanel.style.display === "flex" ? "none" : "flex";
});

chatSend.addEventListener("click", () => {
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;

  addChat("You", userMsg);
  chatInput.value = "";

  // Simple assistant replies (demo)
  let reply = "I'm here to help!";
  if (userMsg.toLowerCase().includes("prompt")) {
    reply = "Try prompts like: 'A futuristic cityscape at sunset' or 'A dragon made of stars'.";
  } else if (userMsg.toLowerCase().includes("upload")) {
    reply = "Click the 'Upload' button to select an image from your device.";
  } else if (userMsg.toLowerCase().includes("generate")) {
    reply = "Type a prompt in the box and hit 'Generate Art'!";
  }

  setTimeout(() => addChat("Assistant", reply), 600);
});

function addChat(sender, message) {
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an assistant that helps users with an AI art generator." },
      { role: "user", content: userMsg }
    ]
  })
});
const data = await response.json();
const reply = data.choices[0].message.content;
addChat("Assistant", reply);
