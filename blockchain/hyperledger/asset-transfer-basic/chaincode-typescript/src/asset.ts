
/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class Asset {
    @Property()
    public docType?: string;

    @Property()
    public ID: string = '';

  @Property()
  public Color: string = '';

  @Property()
  public Size: number = 0;

  @Property()
  public Owner: string = '';

  @Property()
  public AppraisedValue: number = 0;

  @Property()
  public Description?: string;   // Optional field for additional details

  @Property()
  public Location?: string;          // Optional field to categorize the asset

  @Property()
  public Temperature?: number;       // Optional field to track temperature

  @Property()
  public Humidity?: number;          // Optional field to track humidity

  @Property()
  public AdditionalInformation?: string;  // Optional field for any other data
}
