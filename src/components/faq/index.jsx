'use client';
import { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Col,
  Container,
  Row,
} from 'reactstrap';
import Breadcrumb from '../common/Breadcrumb';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslation } from '@/utils/translations';
import FaqCategory from './FaqCategory';
import { useFaqs } from '@/utils/hooks/useFaqs';
import FaqPageSkeleton from './FaqPageSkeleton';

const BrowserFaq = () => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = (id) => {                                                                                                                                                                                                                
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const categoryUid = searchParams.get('categoryUid') || null;

  const { data: response, isLoading } = useFaqs(categoryUid);

  const faqCategories = response?.data?.faqCategories || [];
  const faqGroups = response?.data?.faq || [];

  const activeGroup = categoryUid
    ? faqGroups.find((group) => group.uid === categoryUid)
    : null;

  const faqsToRender = activeGroup
    ? activeGroup.faqs || []
    : faqGroups.flatMap((group) => group.faqs || []);

  const handleCategoryChange = (nextCategoryUid) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextCategoryUid) {
      params.set('categoryUid', nextCategoryUid);
    } else {
      params.delete('categoryUid');
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url, { scroll: false });
  };

  if (isLoading) return <FaqPageSkeleton />;
  return (
    <>
      {/* <Breadcrumb title={`Faq's`} subNavigation={[{ name: `Faq's` }]} /> */}
      <section className="faq-box-contain section-b-space ">
        <FaqCategory
          categories={faqCategories}
          activeCategoryUid={categoryUid}
          onChangeCategory={handleCategoryChange}
        />
        <div className="container-fluid-lg">
          <Row>
            <Col xl={5}>
              <div className="faq-contain">
                <h2>Frequently Asked Questions</h2>
                <p>Find clear and straightforward answers to the most common questions about our services, process,  pricing, and delivery.</p>
              </div>
              
            </Col>
            <Col xl={7}>
              <div className="faq-accordion">
                <Accordion open={open} toggle={toggle}>
                  {faqsToRender?.map((faq, i) => (
                    <AccordionItem key={i}>
                      <AccordionHeader targetId={i + 1}>
                        {faq?.question}
                        {open === i + 1 ? (
                          <RiArrowUpSLine />
                        ) : (
                          <RiArrowDownSLine />
                        )}
                      </AccordionHeader>
                      <AccordionBody accordionId={i + 1}>
                        <p>{faq?.answer}</p>
                      </AccordionBody>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default BrowserFaq;
