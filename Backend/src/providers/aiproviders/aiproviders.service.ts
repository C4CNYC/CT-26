import { LogActivityManagerService } from "@/api/manager/logactivity-manager/logactivity.service";
import { LogActivityCategory } from "@/modules/core/log-activity/log-activity.entity";

export class AIProvidersService {
  constructor(
    private logActivity: LogActivityManagerService) {
  }

  async run({
    max_tokens = 1024,
    model = "claude-opus-4-20250514",
    message = "",
    provider = "Anthropic"
  }: {
    max_tokens?: number;
    model?: string;
      message?: string;
      provider?: string;
    }): Promise<any> {
      // this.logActivity.logActivity(
      //   LogActivityCategory.Lesson,
      //   'Choosing AI provider',
      //   {},
      //   'ok',
      //   { provider, max_tokens, model, message })
    switch (provider) {
      case "DeepSeek":
        return this.DeepSeek({ max_tokens, model, message });
      case "OpenAI":
        return this.OpenAI({ max_tokens, model, message });
      case "Anthropic":
        default:
        return this.Anthropic({ max_tokens, model, message });
    }

    
  }
  async Anthropic({
    max_tokens = 1024,
    model = "claude-opus-4-20250514",
    message = ""
  }: {
    max_tokens?: number;
    model?: string;
    message?: string;
  }): Promise<any> {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.Anthropic ?? "",
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model,
          max_tokens,
          messages: [
            { role: "user", content: message }
          ]
        })
      }).then(res => res.json()) as { content?: { text?: string }[] };
      // this.logActivity.logActivity(
      //   LogActivityCategory.Lesson,
      //   'Anthropic response',
      //   {},
      //   'ok',
      //   { message, response })
      return response?.content?.[0].text||'';
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  }
  async OpenAI({
    max_tokens = 1024,
    model = "gpt-4-0613",
    message = ""
  }: {
    max_tokens?: number;
    model?: string;
    message?: string;
  })
  : Promise<any> {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          max_tokens,
          messages: [
            { role: "user", content: message }
          ]
        })
      }).then(res => res.json()) as { choices?: { message?: { content?: string } }[] };
      // this.logActivity.logActivity(
      //   LogActivityCategory.Lesson,
      //   'OpenAI response',
      //   {},
      //   'ok',
      //   { message, response })
      return response?.choices?.[0]?.message?.content || '';
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  }

  async DeepSeek({
    max_tokens = 1024,
    model = "deepseek-chat-3.5-turbo",
    message = ""
  }: {
    max_tokens?: number;
    model?: string;
    message?: string;
  }): Promise<any> {
   
    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DeepSeek ?? ""}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          max_tokens,
          messages: [
            { role: "user", content: message }
          ]
        })
      }).then(res => res.json()) as { choices?: { message?: { content?: string } }[] };
      // this.logActivity.logActivity(
      //   LogActivityCategory.Lesson,
      //   'DeepSeek response',
      //   {},
      //   'ok',
      //   { message, response })
      return response?.choices?.[0]?.message?.content || '';
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }

  }


}