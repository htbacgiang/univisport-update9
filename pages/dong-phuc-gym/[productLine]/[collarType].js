import { productTaxonomy } from '../../../lib/productTaxonomy';
import { setPublicCacheHeaders } from "../../../lib/cacheControl";

const CATEGORY_SLUG = 'dong-phuc-gym';

// Không còn trang con riêng cho từng kiểu cổ — Đồng phục Gym chỉ lọc ngay
// trên /dong-phuc-gym qua query ?line=&collar=. Giữ redirect 301 để không mất
// SEO/backlink của các URL /dong-phuc-gym/[productLine]/[collarType] đã tồn tại trước đó.
export default function GymCollarTypeRedirect() {
  return null;
}

export async function getServerSideProps({ res, params } = {}) {
  setPublicCacheHeaders(res);
  const { productLine, collarType } = params;
  const lineConfig = productTaxonomy[CATEGORY_SLUG]?.productLines?.[productLine];
  const collarLabel = lineConfig?.collarTypes?.[collarType];

  if (!lineConfig || !collarLabel) {
    return { notFound: true };
  }

  return {
    redirect: {
      destination: `/${CATEGORY_SLUG}?line=${productLine}&collar=${collarType}`,
      permanent: true,
    },
  };
}
