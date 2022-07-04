import { MenuItem } from '../../core/models/common/menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        link: '/dashboard',
        permission: ['F_DASHBOARD'],
    },
    {
        id: 2,
        label: 'MENUITEMS.CLIENT.TEXT',
        icon: 'bx bx-group',
        link: '',
        permission: ['F_CLIENT'],
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.CLIENT.LIST.CLUB_MEMBER',
                link: '/club-members',
                parentId: 2,
                permission: ['F_CLUBMEMBER'],
            },
        ]
    },
    {
        id: 4,
        label: 'MENUITEMS.GM_PT_LEADER.TEXT',
        icon: 'bx bx-group',
        link: '/employess',
        permission: ['F_PT'],
        subItems: [
            {
                id: 5,
                label: 'MENUITEMS.GM_PT_LEADER.LIST.REQUEST_GM',
                link: '/employees/request-gm',
                parentId: 4,
                permission: ['G_LISTPTREQUESTSALEGM'],
            },
            {
                id: 6,
                label: 'MENUITEMS.GM_PT_LEADER.LIST.REQUEST_PT',
                link: '/employees/request-leader',
                parentId: 4,
                permission: ['G_LISTPTREQUESTSALELEADER'],
            },
            {
                id: 7,
                label: 'MENUITEMS.GM_PT_LEADER.LIST.GM',
                link: '/employees/list-gm',
                parentId: 4,
                permission: ['G_LISTGM'],
            },
            {
                id: 8,
                label: 'MENUITEMS.GM_PT_LEADER.LIST.PT',
                link: '/employees/list-pt',
                parentId: 4,
                permission: ['G_LISTPT']
            },
            {
                id: 9,
                label: 'MENUITEMS.GM_PT_LEADER.LIST.LEADER',
                link: '/employees/list-pt-leader',
                parentId: 4,
                permission: undefined
            },
            {
                id: 10,
                label: 'MENUITEMS.GM_PT_LEADER.LIST.PT_CALENDAR',
                link: '/employees/pt-calendar-booking',
                parentId: 4,
                permission: ['G_CALENDAR']
            },
            {
                id: 11,
                label: 'MENUITEMS.GM_PT_LEADER.LIST.GROUP_PT',
                link: '/employees/group-pt',
                parentId: 4,
                permission: ['G_PTGROUP']
            },
        ]
    },
    {
        id: 12,
        label: 'MENUITEMS.STAFF.TEXT',
        icon: 'bx bxs-shield-alt-2',
        link: '/staff',
        permission: ['F_STAFF'],
        subItems: [
            {
                id: 13,
                label: 'MENUITEMS.STAFF.LIST.STAFF',
                link: '/staff/list-staff',
                parentId: 12,
                permission: ['G_LISTSTAFF']
            }
        ]
    },
    {
        id: 14,
        label: 'MENUITEMS.INVENTORY.TEXT',
        icon: 'bx bxs-layer',
        link: '/inventory',
        permission: ['F_INVENTORY'],
        subItems: [
            {
                id: 15,
                label: 'MENUITEMS.INVENTORY.LIST.PRODUCT_CATEGORY',
                link: '/inventory/list-product-category',
                parentId: 14,
                permission: ['G_LISTPROCATE']
            },
            {
                id: 16,
                label: 'MENUITEMS.INVENTORY.LIST.PRODUCT_LIST',
                link: '/inventory/list-product',
                parentId: 14,
                permission: ['G_LISTPRODUCT']
            },
            {
                id: 17,
                label: 'MENUITEMS.INVENTORY.LIST.WAREHOUSE',
                link: '/inventory/list-warehouse',
                parentId: 14,
                permission: ['F_WAREHOUSE']
            },
            {
                id: 18,
                label: 'MENUITEMS.INVENTORY.LIST.WAREHOUSE_INVENTORY',
                link: '/inventory/list-warehouse-inventory',
                parentId: 14,
                permission: ['G_LISTWAREHOUSEINVENTORY']
            },
            {
                id: 19,
                label: 'MENUITEMS.INVENTORY.LIST.SUPPLIER',
                link: '/inventory/list-supplier',
                parentId: 14,
                permission: ['G_LISTSUPPLIER']
            },
            {
                id: 20,
                label: 'MENUITEMS.INVENTORY.LIST.INVENTORY_ORDER',
                link: '/inventory/list-inventory-order',
                parentId: 14,
                permission: ['G_LISTORDER']
            }
        ]
    },
    {
        id: 13,
        label: 'MENUITEMS.CLASS.TEXT',
        icon: 'bx bxs-calendar',
        link: '/class',
        permission: ['F_CLASS'],
        subItems: [
            {
                id: 13,
                label: 'MENUITEMS.CLASS.LIST.CLASS_MANAGEMENT',
                link: '/class/class-management',
                parentId: 14,
                permission: ['F_CLASSES']
            },
            {
                id: 13,
                label: 'MENUITEMS.CLASS.LIST.CLASS_CALENDAR',
                link: '/class/class-calendar',
                parentId: 14,
                permission: ['G_LISTCLASSCALBOOKING']
            },
            {
                id: 13,
                label: 'MENUITEMS.CLASS.LIST.CLASS_BOOKING',
                link: '/class/list-class-booking',
                parentId: 14,
                permission: ['G_LISTCLASSBOOKING']
            }
        ]
    },
    {
        id: 14,
        label: 'MENUITEMS.REPORTS.TEXT',
        icon: 'bx bxs-report',
        link: '/reports',
        permission: ['F_REPORT'],
        subItems: [
            {
                id: 19,
                label: 'MENUITEMS.REPORTS.LIST.REVENUE',
                link: '/reports/revenue',
                parentId: 18,
                permission: ['F_REVENUE']
            },
            {
                id: 20,
                label: 'MENUITEMS.REPORTS.LIST.PAYROLL',
                link: '/reports/payroll',
                parentId: 18,
                permission: ['F_PAYROLL']
            },
            {
                id: 21,
                label: 'MENUITEMS.REPORTS.LIST.CUSTOMER',
                link: '/reports/customers',
                parentId: 18,
                permission: ['F_CUSTOMER']
            }
        ]
    },
    {
        id: 22,
        label: 'MENUITEMS.SUBSCRIPTIONS.TEXT',
        icon: 'bx bx-paper-plane',
        link: '/subscriptions',
        permission: ['F_SUBSCRIPTION'],
        subItems: [
            {
                id: 23,
                label: 'MENUITEMS.SUBSCRIPTIONS.LIST.TNG-PAY',
                link: '/subscriptions/tng-pay',
                parentId: 22,
                permission: undefined
            }
        ]
    },
];

