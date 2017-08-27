import { Component } from '@angular/core';
import {ConsumptionPage} from "../consumption/consumption";
import {JournalPage} from "../journal/journal";
import {RecipePage} from "../recipe/recipe";
import {StockPage} from "../stock/stock";
import {SettingsPage} from "../settings/settings";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = JournalPage;
  tab2Root = RecipePage;
  tab3Root = StockPage;
  tab4Root = ConsumptionPage;
  tab5Root = SettingsPage;

  constructor() {

  }
}
