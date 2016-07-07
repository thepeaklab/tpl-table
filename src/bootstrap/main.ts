import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { TRANSLATE_PROVIDERS } from 'ng2-translate/ng2-translate';

import { RootComponent } from '../root.component';

bootstrap(RootComponent, [
  HTTP_PROVIDERS,
  TRANSLATE_PROVIDERS
])
.catch(error => {
  console.error(error);
});
