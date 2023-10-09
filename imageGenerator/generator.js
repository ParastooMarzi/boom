const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const OPENAI_API_KEY = "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";
let isImageGenerating = false;
const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        //set the image source to AI-generated image data
        const aiGeneratedImg =`data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;
         //when the image is loaded, remove the loading class and set download attributes
         imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href" , aiGeneratedImg);
            downloadBtn.setAttribute("download",`${new Date().getTime()}.jpg`);
         }
})
}

const generateAiImages = async(userPrompt, userImgQuantity) => {
    try{
        //send a request to the openAI API to generate images based on user inputs
        const response = await fetch("https://api.openai.com/v1/images/generations" ,{
            method: "POST",
            headers: {
                "Content-Type" : "application/json" ,
                "Authorization":`Bearer ${OPENAI_API_KEY}`
            },

            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"

            })
        });
        if(!response.ok) throw new Error ("Welcome, this process may take some time! pleas be patient.");
        const {data} = await response.json(); //Get data from the response
        updateImageCard([...data])

        } catch (error) {
        alert(error.message);
        } finally{
            isImageGenerating = false;
        }
}
const handleFormSubmission = async(e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating =true;
    //Get user input and image quantity values from the form
    
    const userPrompt = e.srcElement[2].value; 
    const userImgQuantity = e.srcElement[1].value;

    generateAiImages( userPrompt, userImgQuantity);

    //call generateAiImages with the user input
    await generateAiImages(userPrompt,userImgQuantity);

    const imgCardMarkup = Array.from({length: userImgQuantity},() =>
        `<div class="img-card loading">
           <img src="images/loader.svg" alt="image">
           <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download icon">
           </a>
        </div>`
    ).join("");

   imageGallery.innerHTML = imgCardMarkup;
}

generateForm.addEventListener("submit", handleFormSubmission);



