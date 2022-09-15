import { CustomResourceHandlerBase } from '@awboost/cfn-custom-resource';
import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  decodeGetStreamArnAttributes,
  GetStreamArnAttributes,
} from './GetStreamArnAttributes.js';
import {
  decodeGetStreamArnProps,
  GetStreamArnProps,
} from './GetStreamArnProps.js';

const dynamo = new DynamoDBClient({});

class GetStreamArnResourceHandler extends CustomResourceHandlerBase<
  GetStreamArnProps,
  GetStreamArnAttributes
> {
  constructor() {
    super(decodeGetStreamArnProps, decodeGetStreamArnAttributes);
  }

  protected override async createResource(): Promise<void> {
    await this.getStreamArn();
  }

  protected override async updateResource(): Promise<void> {
    await this.getStreamArn();
  }

  private async getStreamArn(): Promise<void> {
    const result = await dynamo.send(
      new DescribeTableCommand({ TableName: this.properties.TableName }),
    );

    if (
      !result.Table ||
      !result.Table.LatestStreamArn ||
      !result.Table.StreamSpecification?.StreamEnabled
    ) {
      this.status = 'FAILED';
      this.reason = `The table ${this.properties.TableName} does not have streams enabled`;
    } else {
      this.data = {
        LatestStreamArn: result.Table?.LatestStreamArn,
      };
    }
  }
}

export const handler = new GetStreamArnResourceHandler().getHandler();
