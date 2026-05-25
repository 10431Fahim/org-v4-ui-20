import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CabinetService } from '../../services/common/cabinet.service';
import { FilterData } from '../../interfaces/core/filter-data';

interface CouncilMember {
    name: string;
    nameBn: string;
    designation: string;
    designationBn: string;
    initials: string;
    color: string;
    image?: string;
    cabinetType?: string;
}

@Component({
    selector: 'app-cabinet-council',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './cabinet-council.component.html',
    styleUrls: ['./cabinet-council.component.scss']
})
export class CabinetCouncilComponent implements OnInit {
    private translateService = inject(TranslateService);
    private title = inject(Title);
    private meta = inject(Meta);
    private activatedRoute = inject(ActivatedRoute);
    private cabinetService = inject(CabinetService);
    private destroyRef = inject(DestroyRef);

    language = signal<string>('bn');
    premier = signal<CouncilMember | null>(null);
    members = signal<CouncilMember[]>([]);
    slug = signal<string | null>(null);
    headline = signal<string>('Council of Ministers');
    headlineBn = signal<string>('মন্ত্রিপরিষদ সদস্যবৃন্দ');

    isBengali() {
        return this.language() === 'bn';
    }

    ngOnInit(): void {
        // Set initial language from service
        const currentLang = this.translateService.currentLang || this.translateService.defaultLang || 'en';
        this.language.set(currentLang);

        // Subscribe to language changes
        this.translateService.onLangChange.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(event => {
            this.language.set(event.lang);
        });

        // Also check query params as a backup
        this.activatedRoute.queryParamMap.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(params => {
            const lang = params.get('language');
            if (lang) {
                this.language.set(lang);
            }
        });

        this.activatedRoute.paramMap.subscribe(params => {
            this.slug.set(params.get('slug'));
            this.updateHeadlines();
            this.getCabinetMembers();
        });

        this.updateMeta();
    }

    updateHeadlines() {
        const types = [
            { value: 'Cabinet Ministers', label: 'Council of Ministers', labelBn: 'মন্ত্রিপরিষদ সদস্যবৃন্দ' },
            { value: 'Prime Minister’s Advisory Council', label: 'Prime Minister’s Advisory Council', labelBn: 'প্রধানমন্ত্রীর উপদেষ্টা কাউন্সিল' },
            { value: 'Speaker & Deputy Speaker', label: 'Speaker & Deputy Speaker', labelBn: 'স্পিকার ও ডেপুটি স্পিকার' },
            { value: 'Parliamentary Whips', label: 'Parliamentary Whips', labelBn: 'সংসদীয় হুইপগণ' },
            { value: 'Parliament Members', label: 'Parliament Members', labelBn: 'সংসদ সদস্যবৃন্দ' },
            { value: 'premier', label: 'Prime Minister', labelBn: 'প্রধানমন্ত্রী' },
        ];

        const currentSlug = this.slug() || 'Cabinet Ministers';
        const type = types.find(t => t.value.toLowerCase().trim() === currentSlug.toLowerCase().trim());
        if (type) {
            this.headline.set(type.label);
            this.headlineBn.set(type.labelBn);
        }
    }

    getCabinetMembers() {
        const filterData: FilterData = {
            filter: null,
            pagination: null,
            select: 'name nameBn designation designationBn image initials color serial cabinetType',
            sort: { serial: 1 }
        };

        this.cabinetService.getAllCabinet(filterData).subscribe({
            next: (res) => {
                if (res.success && res.data && res.data.length > 0) {
                    const allData: CouncilMember[] = res.data;
                    const currentSlug = this.slug();
                    const normalizedCurrentSlug = currentSlug?.toLowerCase().trim();

                    const filtered = allData.filter(m => {
                        const mType = m.cabinetType?.toLowerCase().trim();

                        // Case 1: If no slug or default slug 'Cabinet Ministers'
                        if (!normalizedCurrentSlug || normalizedCurrentSlug === 'cabinet ministers') {
                            return !mType || mType === 'cabinet ministers';
                        }

                        // Case 2: If slug is 'premier', match the Prime Minister
                        if (normalizedCurrentSlug === 'premier') {
                            const designation = m.designation?.toLowerCase().trim();
                            const designationBn = m.designationBn?.trim();
                            return mType === 'premier' || 
                                   designation === 'prime minister' || 
                                   designationBn === 'প্রধানমন্ত্রী' ||
                                   (mType === 'cabinet ministers' && (designation?.includes('prime minister') || designationBn?.includes('প্রধানমন্ত্রী')));
                        }

                        // Case 3: Direct match with provided slug
                        return mType === normalizedCurrentSlug;
                    });

                    if (filtered.length > 0) {
                        const isCabinetOrPremier = !normalizedCurrentSlug ||
                            normalizedCurrentSlug === 'cabinet ministers' ||
                            normalizedCurrentSlug === 'premier';
                        if (isCabinetOrPremier) {
                            this.premier.set(filtered[0]);
                            this.members.set(filtered.slice(1));
                        } else {
                            this.premier.set(null);
                            this.members.set(filtered);
                        }
                    } else {
                        this.premier.set(null);
                        this.members.set([]);
                    }
                }
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    updateMeta() {
        this.title.setTitle('Council of Ministers | Cabinet Members');
        this.meta.updateTag({ name: 'description', content: 'List of members of the Council of Ministers' });
    }
}
