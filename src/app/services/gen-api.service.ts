import { Injectable } from '@angular/core';
import { OpenAIApi, Configuration } from 'openai';



  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

@Injectable({
  providedIn: 'root'
})
export class GenApiService {

  constructor() { }


  async generateChat(message:string){
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role:"system", content:`Que hago si mi auto ${message}`}
      ],
      temperature: 0.2
    });
    let data = {role:"", content:""};
    Object.assign(data,completion.data.choices[0].message);
    return data;
  }
}
