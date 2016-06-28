import { bootstrap } from '@angular/platform-browser-dynamic';

import { RootComponent } from '../root.component';

bootstrap(RootComponent)
.catch(error => {
  console.error(error);
});
