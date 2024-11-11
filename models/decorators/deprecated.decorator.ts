import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Deprecated = createParamDecorator(
  (data: { oldParam: string, newParam: string }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const response = ctx.switchToHttp().getResponse();
    const queryParam = request.query[data.oldParam];

    if (queryParam !== undefined) {
      const message = `Query parameter "${data.oldParam}" is deprecated. Please use "${data.newParam}" instead.`;
      response.setHeader('X-Deprecated', message);
    }

    return queryParam;
  },
);
