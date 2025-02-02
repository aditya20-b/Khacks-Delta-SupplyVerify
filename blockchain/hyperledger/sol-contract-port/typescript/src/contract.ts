import { Context, Contract, Transaction } from 'fabric-contract-api';
import { Product, ProductStatus } from './models/Product';
import { Participant } from './models/Participant';
import { Transaction as Tx, TransactionType } from './models/Transaction';

export class SupplyChainContract extends Contract {

  @Transaction()
  public async createProduct(ctx: Context, id: string, name: string): Promise<void> {
    const callerMsp = this.getCallerMsp(ctx);
    if (!this.isManufacturer(ctx)) {
      throw new Error('Only manufacturers can create products');
    }

    const product: Product = {
      id,
      name,
      manufacturer: callerMsp,
      status: ProductStatus.Created,
      location: 'Factory',
      trackingEvents: [],
    };

    await ctx.stub.putState(`PROD_${id}`, Buffer.from(JSON.stringify(product)));
  }

  @Transaction()
  public async proposeTransaction(
    ctx: Context,
    type: TransactionType,
    data: string
  ): Promise<string> {
    const txId = ctx.stub.getTxID();
    const tx: Tx = {
      id: txId,
      type,
      proposer: this.getCallerMsp(ctx),
      data,
      approvals: { [this.getCallerMsp(ctx)]: true },
      approvalCount: 1,
      executed: false,
    };

    await ctx.stub.putState(`TX_${txId}`, Buffer.from(JSON.stringify(tx)));
    return txId;
  }

  @Transaction()
  public async approveTransaction(ctx: Context, txId: string): Promise<void> {
    const txBytes = await ctx.stub.getState(`TX_${txId}`);
    if (!txBytes || txBytes.length === 0) {
      throw new Error('Transaction not found');
    }

    const tx: Tx = JSON.parse(txBytes.toString());
    const callerMsp = this.getCallerMsp(ctx);

    if (tx.approvals[callerMsp]) {
      throw new Error('Already approved by this participant');
    }

    tx.approvals[callerMsp] = true;
    tx.approvalCount++;

    if (tx.approvalCount >= 2) { // 2/3 approval policy
      await this.executeTransaction(ctx, tx);
    }

    await ctx.stub.putState(`TX_${txId}`, Buffer.from(JSON.stringify(tx)));
  }

  private async executeTransaction(ctx: Context, tx: Tx): Promise<void> {
    switch (tx.type) {
      case TransactionType.UpdateProduct:
        const { productId, status, location, data } = JSON.parse(tx.data);
        await this.updateProduct(ctx, productId, status, location, data);
        break;

      case TransactionType.AddParticipant:
        const participant: Participant = JSON.parse(tx.data);
        await this.addParticipant(ctx, participant);
        break;

      default:
        throw new Error('Unknown transaction type');
    }

    tx.executed = true;
  }

  private async updateProduct(
    ctx: Context,
    productId: string,
    status: ProductStatus,
    location: string,
    data: string
  ): Promise<void> {
    const productBytes = await ctx.stub.getState(`PROD_${productId}`);
    if (!productBytes || productBytes.length === 0) {
      throw new Error('Product not found');
    }

    const product: Product = JSON.parse(productBytes.toString());
    product.status = status;
    product.location = location;
    product.trackingEvents.push({
      timestamp: ctx.stub.getTxTimestamp().seconds.low,
      location,
      data,
      participant: this.getCallerMsp(ctx),
    });

    await ctx.stub.putState(`PROD_${productId}`, Buffer.from(JSON.stringify(product)));
  }

  private async addParticipant(ctx: Context, participant: Participant): Promise<void> {
    await ctx.stub.putState(`PART_${participant.id}`, Buffer.from(JSON.stringify(participant)));
  }

  private getCallerMsp(ctx: Context): string {
    return ctx.clientIdentity.getMSPID();
  }

  private isManufacturer(ctx: Context): boolean {
    return this.getCallerMsp(ctx).endsWith('ManufacturerMSP');
  }
}