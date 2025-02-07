import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { main } from './src/app/app.main';
import { AppModule } from './src/app/app.module';
import { serverRoutes } from './src/app/app.routes.server';

@NgModule({
  imports: [AppModule, ServerModule],
  providers: [provideServerRouting(serverRoutes)],
  bootstrap: [main],
})
export class AppServerModule {}
