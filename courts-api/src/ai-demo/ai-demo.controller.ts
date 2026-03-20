import { Body, Controller, Post } from "@nestjs/common";
import { AIDemoService } from "./ai-demo.service";

@Controller("ai-demo")
export class AIDemoController {
  constructor(private readonly aiDemoService: AIDemoService) {}

  @Post("query")
  query(@Body() body: { message?: string }) {
    return this.aiDemoService.handleQuery(body?.message ?? "");
  }
}