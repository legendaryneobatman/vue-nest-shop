import CreatePostPage from "@/pages/PartyCreationPage.vue";
import {createRouter, createWebHistory, RouteLocationNormalized} from 'vue-router';
import PartiesPage from "@/pages/PartiesPage.vue";
import {commonPaths} from "@/settings/commonPaths";
import partyPage from "@/pages/PartyPage.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import SignInPage from "@/pages/SignInPage.vue";
import SignUpPage from "@/pages/SignUpPage.vue";
import {LayoutEnum} from "@/router/@types";
import Cookies from "js-cookie";
export const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: commonPaths.MAIN,
        component: PartiesPage,
      },
      {
        path: commonPaths.CREATE_PARTY,
        component: CreatePostPage,
      },
      {
        path: commonPaths.PARTY_PAGE,
        name: 'partyPage',
        component: partyPage,
        props: true,
      },
      {
        path: commonPaths.PROFILE,
        component: ProfilePage,
      },
      {
        path: commonPaths.SIGN_IN,
        component: SignInPage,
        meta: {
          layout: LayoutEnum.LoginLayout
        }
      },
      {
        path: commonPaths.SIGN_UP,
        component: SignUpPage,
        meta: {
          layout: LayoutEnum.LoginLayout
        }
      }
    ]
  }
);


async function loadLayoutMiddleware(route: RouteLocationNormalized) {
    let { layout } = route.meta
  if (!layout) {
    layout = LayoutEnum.AppLayout
  }
  route.meta.layoutComponent = (await import(`../layouts/${layout}.vue`)).default
}

router.beforeEach(loadLayoutMiddleware)
router.beforeEach((to, from, next) => {
  const tokenExists = Cookies.get('token');

  if (!tokenExists && to.path !== commonPaths.SIGN_IN && to.path !== commonPaths.SIGN_UP) {
    next(commonPaths.SIGN_IN);
    return;
  }

  if (tokenExists && (to.path === commonPaths.SIGN_IN || to.path === commonPaths.SIGN_UP)) {
    next(commonPaths.MAIN);
    return;
  }

  next();
});

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string
  }
}
