//import { inference } from '@huggingface/inference';
const inference = require("@huggingface/inference");

const HF_API_KEY = 'HF_KEY'; // Replace with your Hugging Face API key

const summarizeText = async (text) => {
    const client = new inference(HF_API_KEY);
  
    try {
      const response = await client.textGeneration({
        model: 'facebook/bart-large-cnn',
        inputs: text,
        parameters: {
          max_new_tokens: 50,
        },
      });
      return response.generated_text;
    } catch (error) {
      console.error('Error in summarization:', error);
      return 'Summarization failed.';
    }
  };
  
  export default summarizeText; // <-- Exporting as default  