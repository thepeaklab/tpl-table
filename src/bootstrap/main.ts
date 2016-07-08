import { bootstrap } from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';
import { TRANSLATE_PROVIDERS } from 'ng2-translate/ng2-translate';

import { RootComponent } from '../root.component';

bootstrap(RootComponent, [
  disableDeprecatedForms(),
  HTTP_PROVIDERS,
  provideForms(),
  TRANSLATE_PROVIDERS
])
.catch(error => {
  console.error(error);
});
