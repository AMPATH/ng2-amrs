declare let jQuery: any;

import { Observable } from 'rxjs';


let CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = jQuery('body'),
    $MENU_TOGGLE = jQuery('#menu_toggle'),
    $SIDEBAR_MENU = jQuery('#sidebar-menu'),
    $SIDEBAR_FOOTER = jQuery('.sidebar-footer'),
    $LEFT_COL = jQuery('.left_col'),
    $RIGHT_COL = jQuery('.right_col'),
    $NAV_MENU = jQuery('.nav_menu'),
    $FOOTER = jQuery('footer');

export class MainDashboard {

public windowWidth: number;


  subscribeToWindowWidth() {

    return Observable.fromEvent(window , 'resize')
     .map(this.getWindowSize)
     .subscribe(width => {
        this.adjustSidebar(width);
     });
    }
    getWindowSize(): number {
      return window.innerWidth;
    }

     adjustSidebar( width: number): void {

        if (width < 992) {
             this.narrowSideBar();
        }else {
             this.widenSideBar();
        }
    }

     setInitialWindowSize(): void {

           // show mobile or desktop sidebar
         if ( this.getWindowSize() < 992 ) {
             this.narrowSideBar();
          }

    }

   narrowSideBar(): void {

       document.querySelector('body').classList.remove('nav-md');
       document.querySelector('body').classList.add('nav-sm');

    }

    widenSideBar(): void {

         document.querySelector('body').classList.remove('nav-sm');
         document.querySelector('body').classList.add('nav-md');
    }

    toggleMenu(): void {

     if ( $BODY.hasClass('nav-md') ) {
           $SIDEBAR_MENU.find('li.active ul').hide();
           $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
      }else {
           $SIDEBAR_MENU.find('li.active ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
       }

      $BODY.toggleClass('nav-md nav-sm');
}

  toggleSideBarDropDown(event): void {

         let $li = jQuery(event.target.parentElement);

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            jQuery('ul:first', $li).slideUp();
        } else {
            // prevent closing menu if we are on child menu
           this.closeOpenSideBar();
        if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
        }else {
        if ( $BODY.is( '.nav-sm' ) ) {
               $SIDEBAR_MENU.find( 'li' ).removeClass( 'active active-sm' );
               $SIDEBAR_MENU.find( 'li ul' ).slideUp();
           }
        }
            $li.addClass('active active-sm');

            jQuery('ul:first', $li).slideDown();
        }

}

closeOpenSideBar(): void {


		  // find active menu
        let hasActiveMenu = jQuery('.parent-side-menu-item').hasClass('active');

       if ( hasActiveMenu === true ) {

            let activeMenu = jQuery('.parent-side-menu-item.active');
            activeMenu.removeClass( 'active active-sm');
            jQuery(activeMenu[0]).find('ul').slideUp();
       }

      }
}
