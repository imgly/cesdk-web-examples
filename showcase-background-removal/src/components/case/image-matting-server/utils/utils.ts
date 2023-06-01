export async function measureRuntimeAsync(cb: any) {
  const start = new Date();
  const result = await cb()
  const end = new Date();
  const runtime = (end.getTime() - start.getTime()) / 1000;
  return [result, runtime];

}
