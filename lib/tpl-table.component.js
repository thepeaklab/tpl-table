import template from './tpl-table.component.jade';
import TplTableCtrl from './tpl-table.component.controller';

export default {
  template: template(),
  controller: TplTableCtrl,
  controllerAs: 'tplTableCtrl',
  bindings: {
    tplTableOptions: '<',
    onSearchChange: '&?',
    onPageChange: '&?',
    onPageSizeChange: '&?',
    onRowClick: '&?',
    onAdd: '&?',
    onDelete: '&?',
    onAssign: '&?',
    onEdit: '&?',
    onConfirm: '&?'
  }
};
