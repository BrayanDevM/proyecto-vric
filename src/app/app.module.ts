import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ngx-loading-bar (core, router, http)
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

// Módulos personalizados
import { ComponentsModule } from './components/components.module';
import { MaterialModule } from './material/material.module';
import { GlobalErrorHandler } from './helpers/global-error-handler';
import { ServerErrorInterceptor } from './helpers/server-error-interceptor';

// Rutas
import { AppRoutingModule } from './app-routing.module';

// Páginas
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages/pages.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogAcercaDeComponent } from './components/dialogs/dialog-acerca-de/dialog-acerca-de.component';
import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

export class MyUrlSerializer extends DefaultUrlSerializer
  implements UrlSerializer {
  serialize(tree: UrlTree): string {
    return super.serialize(tree).replace(/\(|\)|\w+-\w+:/g, '');
  }
}

@NgModule({
  declarations: [AppComponent, LoginComponent, PagesComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  entryComponents: [DialogAcercaDeComponent],
  providers: [
    // { provide: UrlSerializer, useClass: MyUrlSerializer }
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
