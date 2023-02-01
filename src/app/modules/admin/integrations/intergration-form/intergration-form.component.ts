import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'eco-intergration-form',
  templateUrl: './intergration-form.component.html',
  styleUrls: ['./intergration-form.component.scss']
})


export class IntergrationFormComponent implements OnInit {

  myData : any;
  side_item : string;
  side_item_des : string;
  tab_item : any;
  myObj : any;
  active_tab : string;
  side_active_tab : string;
  slide_required : boolean = true;
  slide_validate : boolean = true;
  slide_hidden : boolean = true;
  cus_type : string = 'option';
  cus_des :string = 'NA';
  cus_code : string = 'customer_code';
  cus_label : string = 'customer Option';

  panelOpenState = false;

  fileNameDialogRef: MatDialogRef<MatdialogComponent>;
  visible :  boolean = false;

  myform : FormGroup;
  constructor(public dialog: MatDialog, private router : Router, private activeroute : ActivatedRoute) {

   }
  
  toggleCollapse(): void {
    this.visible = !this.visible;
  }
  
  ngOnInit(): void {

    this.myform = new FormGroup({
        'value_opt_type' : new FormControl(''),
        'value_opt_label' : new FormControl(''),
        'value_list_origin' : new FormControl(''),
        'value_list' : new FormControl(''),
        'value_type' : new FormControl(''),
    })

    this.myObj = {
      "endpoints": [ 
          {
              "origin": "source", 
              "type": "values_list"
          },
          {
              "origin": "channel",
              "type": "values_list"
          }
      ],
      "connection": { 
          "code": "connection", 
          "label": "Connection", 
          "description": "Sync products, inventory, orders and tracking to Maropost", 
          "connection_instructions": "For more information on API credentials for Mirakl, please see the following URL:",
          "fields": [ 
              {
                  "code": "name", 
                  "label": "Integration Instance Name", 
                  "type": "text", 
                  "is_secure": "true" 
              },
              {
                  "code": "store_url",
                  "label": "StoreURL",
                  "type": "url"
              },
              {
                  "code": "username",
                  "label": "Username",
                  "type": "text"
              },
              {
                  "code": "api_key",
                  "label": "API Key",
                  "type": "text",
                  "is_secure": "true"
              }
          ]
      },
      "sync_options": [ 
          {
              "code": "orders", 
              "label": "Orders", 
              "description": "Configure mapping when syncing orders from Bunnings to Maropost", 
              "sub_sync_options": [ 
                  {
                      "code": "customer", 
                      "label": "Customer", 
                      "mapping_options": [ 
                          {
                              "code": "customer_option", 
                              "label": "Customer Option", 
                              "description": "", 
                              "type": "option", 
                              "required": true, 
                              "is_hidden":"", 
                              "value_options": [ 
                                  {
                                      "value_option_type": "values_list", 
                                      "values_list_origin": "source", 
                                      "values_list": "CUSTOMER_OPTIONS", 
                                      "value_type": "static" 
                                  }
                              ]
                          },
                          {
                              "code": "Usergroup",
                              "label": "Customer group for new customers",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "display_conditions": "customer_option == create_unique_customer",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "PRICE_GROUPS",
                                      "value_type": "static"
                                  }
                              ]
                          }
                      ]
                  },
                  {
                      "code": "order",
                      "label": "Order",
                      "mapping_options": [
                          {
                              "code": "Username",
                              "label": "Existing Customer Username",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "display_conditions": "customer_option == link_to_existing",
                              "value_options": [
                                  {
                                      "value_option_type": "text_input",
                                      "value_option_label": "Static text",
                                      "value_type": "static"
                                  },
                                  {
                                      "value_option_type": "text_input",
                                      "value_option_label": "Advanced: Custom Source Attribute",
                                      "values_option_origin": "source",
                                      "value_type": "attribute"
                                  },
                                  {
                                      "value_option_type": "decimal_input",
                                      "value_option_label": "Advanced: Custom Channel Attribute",
                                      "values_option_origin": "channel",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "OrderStatus",
                              "label": "Order Status",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ORDER_STATUSES",
                                      "value_type": "static"
                                  },
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "CUSTOM_ORDER_STATUSES",
                                      "value_type": "static"
                                  },
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "NEW_ORDER_STATUSES",
                                      "value_type": "static"
                                  }
                              ]
                          },
                          {
                              "code": "ShippingMethod",
                              "label": "Shipping Method",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "child_attribute_values": [ 
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "channel",
                                      "values_list": "CATEGORY",
                                      "value_type": "static"
                                  }
                              ],
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "SHIPPING_METHODS",
                                      "value_type": "static"
                                  }
                              ]
                          }
                      ]
                  },
                  {
                      "code": "payment",
                      "label": "Payment",
                      "mapping_options": [
                          {
                              "code": "PaymentMethod",
                              "label": "Payment Method",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "child_attribute_values": [
                                  {
                                      "value_list_type": "channel",
                                      "values_list": "PAYMENT_METHODS"
                                  }
                              ],
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "PAYMENT_METHODS",
                                      "value_type": "static"
                                  }
                              ]
                          }
                      ]
                  }
              ]
          },
          {
              "code": "tracking",
              "label": "Tracking",
              "description": "Map Maropost Shipping Services to accepted carriers in Bunnings",
              "sub_sync_options": [
                  {
                      "code": "carrier",
                      "label": "Carrier Mapping",
                      "mapping_options": [
                          {
                              "code": "Carrier",
                              "label": "Carrier",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "child_attribute_values": [
                                  {
                                      "values_list_origin": "channel",
                                      "values_list": "CARRIERS"
                                  }
                              ],
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "SHIPPING_SERVICES",
                                      "value_type": "static"
                                  }
                              ]
                          }
                      ]
                  }
              ]
          },
          {
              "code": "pricing",
              "label": "Pricing",
              "sub_sync_options": [
                  {
                      "mapping_options": [
                          {
                              "code": "pricegroup",
                              "label": "PriceGroup",
                              "description": "",
                              "type": "option",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "PRICE_GROUPS",
                                      "value_type": "static"
                                  }
                              ]
                          },
                          {
                              "code": "price_adjustment_type",
                              "label": "Price Adustment Type",
                              "description": "",
                              "type": "option",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "global",
                                      "values_list": "PRICEADJUSTMENTTYPE",
                                      "value_type": "static"
                                  }
                              ]
                          },
                          {
                              "code": "price_adjustment_value",
                              "label": "Price Adjustment Value",
                              "description": "",
                              "type": "option",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "decimal_input",
                                      "value_option_label": "Enter Price Adjustment Amount",
                                      "value_type": "static"
                                  }
                              ]
                          },
                          {
                              "code": "sync_promo_pricing",
                              "label": "Sync Promo Pricing",
                              "description": "",
                              "type": "option",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "global",
                                      "values_list": "TRUEFALSE",
                                      "value_type": "static"
                                  }
                              ]
                          },
                          {
                              "code": "ignore_promo_dates",
                              "label": "Ignore Promo Dates",
                              "description": "",
                              "type": "option",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "global",
                                      "values_list": "TRUEFALSE",
                                      "value_type": "static"
                                  }
                              ]
                          }
                      ]
                  }
              ]
          },
          {
              "code": "inventory",
              "label": "Inventory",
              "sub_sync_options": [
                  {
                      "code": "stock",
                      "label": "Stock on Hand",
                      "mapping_options": [
                          {
                              "code": "take_stock_from",
                              "label": "Take Stock From",
                              "description": "",
                              "type": "option",
                              "required": true,
                              "default_value": "AvailableSellQauntity",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "value_origin": "source",
                                      "values_list": "QTY_COMMON_CHOICES",
                                      "value_type": "option"
                                  },
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "WAREHOUSES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "stock_buffer",
                              "label": "Stock Buffer",
                              "description": "",
                              "type": "option",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "decimal_input",
                                      "value_option_label": "Enter Stock Buffer Amount",
                                      "value_type": "static"
                                  },
                                  {
                                      "value_option_type": "decimal_input",
                                      "value_option_label": "Advanced: Custom Source Attribute",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "virtual_stock_quantity",
                              "label": "Virtual Stock Quantity",
                              "description": "",
                              "type": "option",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "decimal_input",
                                      "value_option_label": "Enter Virtual Stock Quantity",
                                      "value_type": "static"
                                  }
                              ]
                          },
                          {
                              "code": "holiday_mode",
                              "label": "Holiday Mode",
                              "description": "",
                              "type": "option",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "global",
                                      "values_list": "TRUEFALSE",
                                      "value_type": "static"
                                  }
                              ]
                          }
                      ]
                  }
              ]
          },
          {
              "code": "products",
              "label": "Products",
              "description": "Configure mapping when syncing products from Maropost to Bunnings",
              "sub_sync_options": [
                  {
                      "code": "feed",
                      "label": "Feed",
                      "mapping_options": [
                          {
                              "code": "in_usergroup",
                              "label": "UserGroup Visiblity",
                              "description": "",
                              "type": "option",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "PRICE_GROUPS",
                                      "value_type": "static"
                                  }
                              ]
                          },
                          {
                              "code": "custom_field",
                              "label": "Custom Field = True",
                              "description": "",
                              "type": "option",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "CUSTOM_FIELDS",
                                      "value_type": "static"
                                  }
                              ]
                          },
                          {
                              "code": "is_active",
                              "label": "Is Active = True",
                              "description": "",
                              "type": "option",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "global",
                                      "values_list": "TRUEFALSE",
                                      "value_type": "static"
                                  }
                              ]
                          },
                          {
                              "code": "is_approved",
                              "label": "Is Approved = True",
                              "description": "",
                              "type": "option",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "global",
                                      "values_list": "TRUEFALSE",
                                      "value_type": "static"
                                  }
                              ]
                          },
                          {
                              "code": "pim_ListToBunnings",
                              "label": "List to Bunnings = True",
                              "description": "",
                              "type": "option",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "global",
                                      "values_list": "TRUEFALSE",
                                      "value_type": "static"
                                  }
                              ]
                          }
                      ]
                  },
                  {
                      "code": "attribute",
                      "label": "Attributes",
                      "mapping_options": [
                          {
                              "code": "DISPLAY_NAME",
                              "label": "DISPLAY_NAME",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "BRAND",
                              "label": "BRAND",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "GTIN",
                              "label": "GTIN",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "PRODUCT_DESCRIPTION",
                              "label": "PRODUCT_DESCRIPTION",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "PRIMARY_UOM",
                              "label": "PRIMARY_UOM",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "VARIANT_GROUP_CODE",
                              "label": "VARIANT_GROUP_CODE",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "KEY_SELLING_POINT_1",
                              "label": "KEY_SELLING_POINT_1",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "KEY_SELLING_POINT_2",
                              "label": "KEY_SELLING_POINT_2",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "KEY_SELLING_POINT_3",
                              "label": "KEY_SELLING_POINT_3",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "KEY_SELLING_POINT_4",
                              "label": "KEY_SELLING_POINT_4",
                              "description": "",
                              "type": "attribute",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "WARRANTY_INFORMATION",
                              "label": "WARRANTY_INFORMATION",
                              "description": "",
                              "type": "attribute",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "PRODUCT_WIDTH",
                              "label": "PRODUCT_WIDTH",
                              "description": "",
                              "type": "attribute",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "PRODUCT_HEIGHT",
                              "label": "PRODUCT_HEIGHT",
                              "description": "",
                              "type": "attribute",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "PRODUCT_LENGTH",
                              "label": "PRODUCT_LENGTH",
                              "description": "",
                              "type": "attribute",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "MATERIAL",
                              "label": "MATERIAL",
                              "description": "",
                              "type": "attribute",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "PRODUCT_WEIGHT",
                              "label": "PRODUCT_WEIGHT",
                              "description": "",
                              "type": "attribute",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "PRODUCT_WEIGHT",
                              "label": "PRODUCT_WEIGHT",
                              "description": "",
                              "type": "attribute",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "product-id",
                              "label": "product-id",
                              "description": "",
                              "type": "attribute",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "channel",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "product-id-type",
                              "label": "product-id-type",
                              "description": "",
                              "type": "attribute",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "channel",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "state",
                              "label": "state",
                              "description": "",
                              "type": "attribute",
                              "required": "false",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "channel",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "logistic-class",
                              "label": "logistic-class",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "channel",
                                      "values_list": "ATTRIBUTES",
                                      "value_type": "attribute"
                                  }
                              ]
                          }
                      ]
                  },
                  {
                      "code": "category",
                      "label": "Category",
                      "mapping_options": [
                          {
                              "code": "content_type",
                              "label": "Content Type",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "value_list_origin": "source",
                                      "value_list": "CONTENT_TYPES",
                                      "value_type": "static"
                                  }
                              ]
                          },
                          {
                              "code": "CATEGORY",
                              "label": "Category",
                              "child_attribute_values": [
                                  {
                                      "value_option_type": "category",
                                      "category_origin": "source"
                                  }
                              ],
                              "value_options": [
                                  {
                                      "value_option_type": "category",
                                      "value_list_origin": "channel",
                                      "value_list": "CATEGORIES",
                                      "value_type": "static"
                                  }
                              ]
                          }
                      ]
                  },
                  {
                      "code": "image",
                      "label": "Images",
                      "mapping_options": [
                          {
                              "code": "MainImage",
                              "label": "MainImage",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "IMAGES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "Image1",
                              "label": "Image1",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "IMAGES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "Image2",
                              "label": "Image2",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "IMAGES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "Image3",
                              "label": "Image3",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "IMAGES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "Image4",
                              "label": "Image4",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "IMAGES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "Image5",
                              "label": "Image5",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "IMAGES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "Image6",
                              "label": "Image6",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "IMAGES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "Image7",
                              "label": "Image7",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "IMAGES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "Image8",
                              "label": "Image8",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "IMAGES",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "Image9",
                              "label": "Image9",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "IMAGES",
                                      "value_type": "attribute"
                                  }
                              ]
                          }
                      ]
                  }
              ]
          }
      ]
  }
    
   this.side_item = 'endpoints' || this.myObj.connection.label
   this.side_item_des = ''
  }

// set name and description of main tabs click 
  click_main_tab(item:any){
        if(item == 'endpoints'){
            this.tab_item = null
            this.side_item = item
            this.side_item_des = this.myObj.endpoints.description
        }
        if(item == 'connection'){
            this.tab_item = null
            this.side_item = item
            this.side_item_des = this.myObj.connection.description
        }
  }

// click on sub tabs of side panel 
  click_sync_option(item:any){
      this.side_active_tab = item.label
      this.side_item = item.label
      this.side_item_des = item.description
      let result = this.myObj.sync_options.filter((i:any) => i.label == item.label)
      this.tab_item = result[0].sub_sync_options
  }

//   add new item in sub of sub tabs 
  add_tab_item(){
    let diologref = this.dialog.open(MatdialogComponent)
    diologref.afterClosed().subscribe((result:any) => {
        if(result != undefined){
            let response : any = this.myObj.sync_options.filter((i:any) => i.label == this.side_item)
            let cusObj = {
                "code": result, 
                "label": result, 
                "mapping_options": [ 
                    {
                        "code": "customer_option", 
                        "label": "Customer Option", 
                        "description": "", 
                        "type": "option", 
                        "required": true, 
                        "is_hidden":"", 
                        "value_options": [ 
                            {
                                "value_option_type": "values_list", 
                                "values_list_origin": "source", 
                                "values_list": "CUSTOMER_OPTIONS", 
                                "value_type": "static" 
                            }
                        ]
                    },
                    {
                        "code": "Usergroup",
                        "label": "Customer group for new customers",
                        "description": "",
                        "type": "attribute",
                        "required": "true",
                        "display_conditions": "customer_option == create_unique_customer",
                        "value_options": [
                            {
                                "value_option_type": "values_list",
                                "values_list_origin": "source",
                                "values_list": "PRICE_GROUPS",
                                "value_type": "static"
                            }
                        ]
                    }
                ]
            }
            response[0].sub_sync_options.push(cusObj)
        }
    })
  }

//   open side pane dialog and also add new side tabs 
  openDialog(){
    this.fileNameDialogRef = this.dialog.open(MatdialogComponent);
    this.fileNameDialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            let newObj =  {
              "code": result, 
              "label": result, 
              "description": "Configure mapping when syncing orders from Bunnings to Maropost", 
              "sub_sync_options": [ 
                  {
                      "code": "customer", 
                      "label": "Customer", 
                      "mapping_options": [ 
                          {
                              "code": "customer_option", 
                              "label": "Customer Option", 
                              "description": "", 
                              "type": "option", 
                              "required": true, 
                              "is_hidden":"", 
                              "value_options": [ 
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source", 
                                      "values_list": "CUSTOMER_OPTIONS", 
                                      "value_type": "static" 
                                  }
                              ]
                          },
                          {
                              "code": "Usergroup",
                              "label": "Customer group for new customers",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "display_conditions": "customer_option == create_unique_customer",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "PRICE_GROUPS",
                                      "value_type": "static"
                                  }
                              ]
                          }
                      ]
                  },
                  {
                      "code": "order",
                      "label": "Order",
                      "mapping_options": [
                          {
                              "code": "Username",
                              "label": "Existing Customer Username",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "display_conditions": "customer_option == link_to_existing",
                              "value_options": [
                                  {
                                      "value_option_type": "text_input",
                                      "value_option_label": "Static text",
                                      "value_type": "static"
                                  },
                                  {
                                      "value_option_type": "text_input",
                                      "value_option_label": "Advanced: Custom Source Attribute",
                                      "values_option_origin": "source",
                                      "value_type": "attribute"
                                  },
                                  {
                                      "value_option_type": "decimal_input",
                                      "value_option_label": "Advanced: Custom Channel Attribute",
                                      "values_option_origin": "channel",
                                      "value_type": "attribute"
                                  }
                              ]
                          },
                          {
                              "code": "OrderStatus",
                              "label": "Order Status",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "ORDER_STATUSES",
                                      "value_type": "static"
                                  },
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "CUSTOM_ORDER_STATUSES",
                                      "value_type": "static"
                                  },
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "NEW_ORDER_STATUSES",
                                      "value_type": "static"
                                  }
                              ]
                          },
                          {
                              "code": "ShippingMethod",
                              "label": "Shipping Method",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "child_attribute_values": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "channel",
                                      "values_list": "CATEGORY",
                                      "value_type": "static"
                                  }
                              ],
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "SHIPPING_METHODS",
                                      "value_type": "static"
                                  }
                              ]
                          }
                      ]
                  },
                  {
                      "code": "payment",
                      "label": "Payment",
                      "mapping_options": [
                          {
                              "code": "PaymentMethod",
                              "label": "Payment Method",
                              "description": "",
                              "type": "attribute",
                              "required": "true",
                              "child_attribute_values": [
                                  {
                                      "value_list_type": "channel",
                                      "values_list": "PAYMENT_METHODS"
                                  }
                              ],
                              "value_options": [
                                  {
                                      "value_option_type": "values_list",
                                      "values_list_origin": "source",
                                      "values_list": "PAYMENT_METHODS",
                                      "value_type": "static"
                                  }
                              ]
                          }
                      ]
                  }
              ]
            }
            this.myObj.sync_options.push(newObj)
        }
    });
  }

//   delete tab in sub tab of side panel
  delete_item(item:any){
    let new_sync_option = this.myObj.sync_options.filter((i:any) => i.code != item.code)
    this.myObj.sync_options = new_sync_option
  }

//   set active class in sub_sub sync tab 
  set_active_tab(item:any){
     this.active_tab = item.label
  }

//  customer slide required event 
  sliderequired(event:any){
    this.slide_required = event.checked  
  }

//  customer slide validate event 
  slidevalidate(event:any){
    this.slide_validate = event.checked
  }

// customer slide hidden event 
  slidehidden(event:any){
    this.slide_hidden = event.checked
  }

//   get customer type 
  get_type(event:any){
    this.cus_type = event
  }

  //   get customer code 
  get_cus_code(event:any){
    this.cus_code = event.target.value
  }
  //   get customer label 
  get_cus_label(event:any){
    this.cus_label = event.target.value
  }
  //   get customer description 
  get_cus_description(event:any){
    this.cus_des = event.target.value
  }

  submitform(){

    let newobj = {
        "endpoints": [ 
            {
                "origin": "source", 
                "type": "values_list"
            },
            {
                "origin": "channel",
                "type": "values_list"
            }
        ],
        "connection": { 
            "code": "connection", 
            "label": "Connection", 
            "description": "Sync products, inventory, orders and tracking to Maropost", 
            "connection_instructions": "For more information on API credentials for Mirakl, please see the following URL:",
            "fields": [ 
                {
                    "code": "name", 
                    "label": "Integration Instance Name", 
                    "type": "text", 
                    "is_secure": "true" 
                },
                {
                    "code": "store_url",
                    "label": "StoreURL",
                    "type": "url"
                },
                {
                    "code": "username",
                    "label": "Username",
                    "type": "text"
                },
                {
                    "code": "api_key",
                    "label": "API Key",
                    "type": "text",
                    "is_secure": "true"
                }
            ]
        },

        "sync_options" : [
            {
                "code": this.side_item, 
                "label": this.side_item, 
                "description": this.side_item_des, 
                "sub_sync_options": [ 
                    {
                        "code": this.active_tab,
                        "label": this.active_tab, 
                        "mapping_options": [ 
                            {
                                "code": this.cus_code, 
                                "label": this.cus_label, 
                                "description": this.cus_des, 
                                "type": this.cus_type || 'option',
                                "required": this.slide_required, 
                                "is_hidden":this.slide_hidden, 
                                "validate" : this.slide_validate,
                                "value_options": [ 
                                    {
                                        "value_option_type": this.myform.value.value_opt_type, 
                                        "values_list_origin": this.myform.value.value_list_origin, 
                                        "values_list": this.myform.value.value_list, 
                                        "value_type": this.myform.value.value_type
                                    }
                                ]
                            },
                        ]
                    },
                ]
            },
        ]
    }

    console.log("newobj",newobj);
  }

}

@Component({
  selector: 'mat-dialog',
  templateUrl: '../matdialog/matdialog.component.html',
  styleUrls : ['../matdialog/matdialog.component.scss']
})

export class MatdialogComponent {

  constructor(public dialogRef: MatDialogRef<MatdialogComponent>){
  }

  clodemodel(){
    this.dialogRef.close()
  }

  savedata(input:any){
      this.dialogRef.close(`${input.value}`)

  }

}
