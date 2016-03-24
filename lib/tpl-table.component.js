import template from './tpl-table.jade';
import TplTableCtrl from './tpl-table.controller';

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
