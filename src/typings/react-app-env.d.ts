declare module "*.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.ts' {
  const src: string;
  export default src;
}