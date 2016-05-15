// Global defenitions

var DEBUG = false;

// Components
var DOWNLOAD_LIST_DIV_ID = 'divDownlaodList';
var DOWNLOAD_FILTER_DIV_ID = 'divDownlaodFilter';
var EXT_FILTERS_DIV_ID = 'divExtFilters';
var CUSTOM_FILTER_INPUT_ID = 'customFilterInputId';
var FOOTER_DIV_ID = 'divFooter';
var NO_LINKS_MESSAGE_DIV_ID = 'divNoLinkMessage';
var DELIM_DIVS_NAME = 'delim';
var LINK_ROW_ELEM_ID_PREFIX = 'row';
var LINKS_TABLE_ID = 'linksTableId';
var LINKS_TBL_HDR_ROW_ID = 'linkTblHeaderRowId';
var LINKS_TBL_BODY_ID = 'linksTblBodyId';
var DOWNLOAD_FILES_AMOUNT_LBL_DIV_ID = 'divDownloadFilesAmount';
var BLOG_LINK_IMAGE = 'images/blogger_icon.png';
var DONATE_LINK_IMAGE = 'images/sponsor_dm.png';

// Page style
var PAGE_DEFAULT_WIDTH = '420';
var PAGE_DEFAULT_HEIGHT = '118';
var PAGE_MINIMUM_WIDTH = '470';
var PAGE_DEFAULT_SCROLL_STYLE = 'hidden';
var BLOG_LINK_HEIGHT = '20';
var BLOG_LINK_WIDTH = '102';
var DONATE_LINK_HEIGHT = '20';
var DONATE_LINK_WIDTH = '70';
var DONATE_CLMN_WIDTH = '80px';
var LINKS_FILE_SIZE_CLMN_WIDTH = '80px';
var POP_UP_EXT_HEIGHT_MAX = Math.min(600, screen.height / 2); // chrome extension height limit = 600
var POP_UP_EXT_WIDTH_MAX = Math.min(800, screen.width / 2); // chrome extension width limit = 800
var SCROLLER_WIDTH = 20;
var EXT_BODY_MAX_WIDTH = POP_UP_EXT_WIDTH_MAX - SCROLLER_WIDTH;
var DM_FONT_CLASS = 'downloadMasterFont';

// Colors
var UNSELECTED_LINK_COLOR = 'white';
var SELECTED_LINK_COLOR = 'lavender';

// Messages
var PENDING_LOAD_MSG = 'Loading the files list ...';
var NO_LINKS_MSG = 'Too bad, there are no downloadable files on this page.';
var NON_WEBSITE_PAGE = 'This is not a website!';
var CHROME_WEBSTORE_SITE = 'Chrome webstore page rejected a link scan.';

// Global vars
var gContentConnectionPort;
var gLinksStorage = new LinksStorage();

// Google Analytics strings
var GA_ON_CHK_DISPLAY_ALL_LINKS = 'on_show_all_links_chk';
var GA_ON_UNCHK_DISPLAY_ALL_LINKS = 'on_show_all_links_unchk';

// Filter section strings
var SHOW_ALL_LINKS_FILTER_TITLE = 'Show all links';
var SHOW_FILE_SIZE_FILTER_TITLE = 'Show files size';
var FILTER_DISPLAY_OPTIONS_TITLE = 'Display options:';
var CUSTOM_FILTER_TITLE = 'Custom filter:';

// Misc
var COL_RESIZER_DISABLE_PARAM = { disable: true };
var COL_RESIZER_ENABLE_PARAM = { liveDrag: true, minWidth: 80, onResize: null};
var BAD_SIZE_STRING = 'none';
